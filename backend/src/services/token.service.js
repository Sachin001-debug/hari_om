const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const ACCESS_TOKEN_EXPIRY = '15m';
const ACCESS_COOKIE_MAX_AGE_MS = 15 * 60 * 1000; // 15 minutes
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const generateAccessToken = (admin) => {
  return jwt.sign(
    {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      name: admin.name
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: ACCESS_TOKEN_EXPIRY,
      issuer: 'hari-om-real-estate-api',
      audience: 'hari-om-real-estate-admin',
      algorithm: 'HS256'
    }
  );
};

const generateRawRefreshToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const getAccessCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: ACCESS_COOKIE_MAX_AGE_MS
});

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/auth',
  maxAge: REFRESH_COOKIE_MAX_AGE_MS
});

const setAuthCookies = (res, accessToken, refreshToken) => {
  if (accessToken) {
    res.cookie('access_token', accessToken, getAccessCookieOptions());
  }
  if (refreshToken) {
    res.cookie('refresh_token', refreshToken, getRefreshCookieOptions());
  }
};

const clearAuthCookies = (res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });

  res.clearCookie('refresh_token', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth'
  });
};

module.exports = {
  generateAccessToken,
  generateRawRefreshToken,
  hashToken,
  setAuthCookies,
  clearAuthCookies,
  REFRESH_COOKIE_MAX_AGE_MS
};

