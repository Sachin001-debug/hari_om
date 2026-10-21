const crypto = require('crypto');
const { sequelize, Admin, RefreshToken, LoginAudit } = require('../database');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const {
  verifyPassword,
  verifyDummyPassword
} = require('./password.service');
const {
  generateAccessToken,
  generateRawRefreshToken,
  hashToken,
  REFRESH_COOKIE_MAX_AGE_MS
} = require('./token.service');

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Record a login attempt in the login_audits table
 */
const recordLoginAudit = async ({ email, adminId = null, success, ipAddress, userAgent, reason = null }) => {
  try {
    await LoginAudit.create({
      email,
      adminId,
      success,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      reason
    });
  } catch (err) {
    logger.error('Failed to write login audit entry', err);
  }
};

/**
 * Authenticate admin with email and password
 */
const login = async ({ email, password, ipAddress, userAgent }) => {
  const normalizedEmail = email ? email.toLowerCase().trim() : '';

  // 1. Fetch admin by email (with passwordHash loaded via withSecret scope)
  const admin = await Admin.scope('withSecret').findOne({
    where: { email: normalizedEmail }
  });

  // Timing attack protection: if user is not found, run dummy hash verification
  if (!admin) {
    await verifyDummyPassword(password);
    await recordLoginAudit({
      email: normalizedEmail,
      adminId: null,
      success: false,
      ipAddress,
      userAgent,
      reason: 'USER_NOT_FOUND'
    });
    logger.warn('Failed login attempt: Account not found', { email: normalizedEmail, ip: ipAddress });
    throw ApiError.unauthorized('Invalid email or password');
  }

  // 2. Check if account is locked
  const isLocked = admin.lockedUntil && new Date(admin.lockedUntil) > new Date();
  if (isLocked) {
    // Run dummy verify to preserve response time
    await verifyDummyPassword(password);
    await recordLoginAudit({
      email: normalizedEmail,
      adminId: admin.id,
      success: false,
      ipAddress,
      userAgent,
      reason: 'ACCOUNT_LOCKED'
    });
    const remainingMinutes = Math.ceil((new Date(admin.lockedUntil).getTime() - Date.now()) / (60 * 1000));
    logger.security('Login attempt on locked account', { email: normalizedEmail, ip: ipAddress });
    throw ApiError.unauthorized(
      `Account is temporarily locked due to excessive failed attempts. Please try again in ${remainingMinutes} minute(s).`
    );
  }

  // 3. Check if account is active
  if (!admin.isActive) {
    await verifyDummyPassword(password);
    await recordLoginAudit({
      email: normalizedEmail,
      adminId: admin.id,
      success: false,
      ipAddress,
      userAgent,
      reason: 'ACCOUNT_INACTIVE'
    });
    logger.security('Login attempt on inactive account', { email: normalizedEmail, ip: ipAddress });
    throw ApiError.forbidden('Account is inactive. Please contact the administrator.');
  }

  // 4. Verify password
  const isPasswordValid = await verifyPassword(admin.passwordHash, password);

  if (!isPasswordValid) {
    // Increment failed attempts atomically so concurrent attempts cannot bypass lockout counter
    await admin.increment('failedLoginAttempts', { by: 1 });
    await admin.reload({ attributes: ['id', 'failedLoginAttempts', 'lockedUntil'] });

    const newFailedAttempts = admin.failedLoginAttempts;
    let lockoutTriggered = false;

    if (newFailedAttempts >= MAX_FAILED_ATTEMPTS) {
      const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS);
      await admin.update({ lockedUntil });
      lockoutTriggered = true;
    }

    await recordLoginAudit({
      email: normalizedEmail,
      adminId: admin.id,
      success: false,
      ipAddress,
      userAgent,
      reason: lockoutTriggered ? 'LOCKOUT_TRIGGERED' : 'INVALID_PASSWORD'
    });

    logger.warn('Failed login attempt: Invalid password', {
      email: normalizedEmail,
      attempts: newFailedAttempts,
      ip: ipAddress
    });

    if (lockoutTriggered) {
      throw ApiError.unauthorized(
        'Too many failed attempts. Account has been temporarily locked for 15 minutes.'
      );
    }

    throw ApiError.unauthorized('Invalid email or password');
  }

  // 5. Successful login: reset failed attempts and update lastLoginAt
  await admin.update({
    failedLoginAttempts: 0,
    lockedUntil: null,
    lastLoginAt: new Date()
  });

  await recordLoginAudit({
    email: normalizedEmail,
    adminId: admin.id,
    success: true,
    ipAddress,
    userAgent,
    reason: 'SUCCESS'
  });

  logger.info('Admin logged in successfully', { email: normalizedEmail, ip: ipAddress });

  // 6. Generate Tokens
  const safeAdmin = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role
  };

  const accessToken = generateAccessToken(safeAdmin);
  const rawRefreshToken = generateRawRefreshToken();
  const tokenHash = hashToken(rawRefreshToken);
  const familyId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + REFRESH_COOKIE_MAX_AGE_MS);

  await RefreshToken.create({
    adminId: admin.id,
    tokenHash,
    familyId,
    expiresAt,
    userAgent: userAgent || null,
    ipAddress: ipAddress || null
  });

  return {
    admin: safeAdmin,
    accessToken,
    rawRefreshToken
  };
};

/**
 * Rotate Refresh Token with Automatic Reuse Detection
 */
const refreshSession = async ({ rawRefreshToken, ipAddress, userAgent }) => {
  if (!rawRefreshToken) {
    throw ApiError.unauthorized('Refresh token is required');
  }

  const tokenHash = hashToken(rawRefreshToken);
  const t = await sequelize.transaction();

  try {
    // Look up the token by hash with update lock
    const tokenRecord = await RefreshToken.findOne({
      where: { tokenHash },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!tokenRecord) {
      await t.rollback();
      logger.security('Invalid refresh token presented', { ip: ipAddress });
      throw ApiError.unauthorized('Invalid or expired session');
    }

    // REUSE DETECTION: If token was already revoked, someone may be attempting replay attack!
    if (tokenRecord.revokedAt) {
      logger.security('REUSE DETECTION TRIGGERED: Revoked refresh token presented! Invalidating family.', {
        familyId: tokenRecord.familyId,
        adminId: tokenRecord.adminId,
        ip: ipAddress
      });

      // Invalidate entire token family inside the transaction to secure account
      await RefreshToken.update(
        { revokedAt: new Date() },
        {
          where: { familyId: tokenRecord.familyId },
          transaction: t
        }
      );

      // Commit the revocation so the entire family is permanently invalidated
      await t.commit();

      throw ApiError.unauthorized('Suspicious session activity detected. Please log in again.');
    }

    // Expiration check
    if (new Date(tokenRecord.expiresAt) <= new Date()) {
      await tokenRecord.update(
        { revokedAt: new Date() },
        { transaction: t }
      );
      await t.commit();
      throw ApiError.unauthorized('Session has expired. Please log in again.');
    }

    // Admin validation
    const admin = await Admin.findOne({
      where: { id: tokenRecord.adminId },
      transaction: t
    });

    if (!admin || !admin.isActive) {
      await t.rollback();
      throw ApiError.unauthorized('Account is inactive or not found.');
    }

    // Issue new token in same family and rotate
    const newRawRefreshToken = generateRawRefreshToken();
    const newTokenHash = hashToken(newRawRefreshToken);
    const newExpiresAt = new Date(Date.now() + REFRESH_COOKIE_MAX_AGE_MS);

    // Create the new refresh token
    const newRefreshToken = await RefreshToken.create(
      {
        adminId: admin.id,
        tokenHash: newTokenHash,
        familyId: tokenRecord.familyId,
        expiresAt: newExpiresAt,
        userAgent: userAgent || null,
        ipAddress: ipAddress || null
      },
      { transaction: t }
    );

    // Mark old token as revoked and replaced atomically
    await tokenRecord.update(
      {
        revokedAt: new Date(),
        replacedByTokenId: newRefreshToken.id
      },
      { transaction: t }
    );

    await t.commit();

    const safeAdmin = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };

    const newAccessToken = generateAccessToken(safeAdmin);

    return {
      admin: safeAdmin,
      accessToken: newAccessToken,
      rawRefreshToken: newRawRefreshToken
    };
  } catch (err) {
    if (t && !t.finished) {
      await t.rollback();
    }
    throw err;
  }
};

/**
 * Logout admin and invalidate active refresh token
 */
const logout = async (rawRefreshToken) => {
  if (rawRefreshToken) {
    const tokenHash = hashToken(rawRefreshToken);
    await RefreshToken.update(
      { revokedAt: new Date() },
      {
        where: {
          tokenHash,
          revokedAt: null
        }
      }
    );
  }
};

/**
 * Get currently authenticated admin details
 */
const getMe = async (adminId) => {
  const admin = await Admin.findOne({
    where: { id: adminId }
  });

  if (!admin || !admin.isActive) {
    throw ApiError.unauthorized('Admin session invalid or inactive');
  }

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    isActive: Boolean(admin.isActive),
    lastLoginAt: admin.lastLoginAt,
    createdAt: admin.createdAt
  };
};

module.exports = {
  login,
  refreshSession,
  logout,
  getMe
};
