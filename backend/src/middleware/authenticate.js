const jwt = require('jsonwebtoken');
const env = require('../config/env');
const { Admin } = require('../database');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const authenticate = asyncHandler(async (req, res, next) => {
  // Extract token from httpOnly cookie or Authorization header
  let token = req.cookies?.access_token;

  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Authentication required. Please log in.'));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, env.JWT_ACCESS_SECRET, {
      algorithms: ['HS256'],
      issuer: 'hari-om-real-estate-api',
      audience: 'hari-om-real-estate-admin'
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Access token has expired. Refresh required.'));
    }
    return next(new ApiError(401, 'Invalid authentication token.'));
  }

  // Validate admin existence and active status in DB
  const admin = await Admin.findByPk(decoded.sub);

  if (!admin) {
    return next(new ApiError(401, 'User account no longer exists.'));
  }

  if (!admin.isActive) {
    return next(new ApiError(403, 'Account is inactive. Please contact the administrator.'));
  }

  // Attach sanitized admin object to request
  req.admin = {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
    isActive: Boolean(admin.isActive),
    lastLoginAt: admin.lastLoginAt,
    createdAt: admin.createdAt
  };

  next();
});

module.exports = authenticate;
