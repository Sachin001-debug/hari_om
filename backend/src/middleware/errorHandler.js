const env = require('../config/env');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let errors = err.errors || [];

  // Handle specific database errors without exposing details
  if (
    err.code === 'ER_DUP_ENTRY' ||
    err.name === 'SequelizeUniqueConstraintError' ||
    err.original?.code === 'ER_DUP_ENTRY'
  ) {
    statusCode = 409;
    message = 'A resource with this identifier already exists.';
    errors = [];
  } else if (
    (err.code && err.code.startsWith('ER_')) ||
    err.name?.startsWith('Sequelize')
  ) {
    statusCode = 500;
    message = env.NODE_ENV === 'production'
      ? 'A database error occurred. Please try again later.'
      : `Database error: ${err.message}`;
    errors = [];
  }

  // Handle JSON parse syntax errors (e.g. malformed body)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON in request body.';
  }

  // Log errors based on severity
  if (statusCode >= 500) {
    logger.error(`Server Error: ${message}`, err, {
      requestId: req.id,
      path: req.originalUrl,
      method: req.method,
      ip: req.ip,
      adminId: req.admin?.id
    });
  } else if (statusCode >= 400) {
    logger.warn(`Client Error (${statusCode}): ${message}`, {
      requestId: req.id,
      path: req.originalUrl,
      method: req.method,
      ip: req.ip,
      adminId: req.admin?.id,
      errors
    });
  }

  const responseBody = {
    success: false,
    message
  };

  if (errors.length > 0) {
    responseBody.errors = errors;
  }

  if (env.NODE_ENV === 'development' && statusCode >= 500 && err.stack) {
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
};

module.exports = errorHandler;
