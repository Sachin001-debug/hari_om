'use strict';

const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const authorizeAdmin = (req, res, next) => {
  if (!req.admin) {
    logger.security('Unauthorized access attempt: No admin attached to request', {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip
    });
    return next(new ApiError(401, 'Authentication required. Please log in.'));
  }

  const role = req.admin.role;
  if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
    logger.security('Forbidden access attempt: Non-admin role', {
      adminId: req.admin.id,
      role,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip
    });
    return next(new ApiError(403, 'Access denied: Administrator privileges required.'));
  }

  if (!req.admin.isActive) {
    logger.security('Forbidden access attempt: Inactive admin account', {
      adminId: req.admin.id,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip
    });
    return next(new ApiError(403, 'Account is inactive. Please contact the administrator.'));
  }

  next();
};

module.exports = authorizeAdmin;

