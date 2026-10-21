const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

const csrfGuard = (req, res, next) => {
  // Safe idempotent methods are exempt
  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  // 1. Require custom header X-Requested-With: XMLHttpRequest
  // Browsers forbid arbitrary cross-site form/script submissions from setting this header without CORS preflight
  const requestedWith = req.headers['x-requested-with'];
  if (!requestedWith || requestedWith.toLowerCase() !== 'xmlhttprequest') {
    logger.security('Blocked request missing or invalid X-Requested-With header', {
      method: req.method,
      path: req.originalUrl,
      ip: req.ip
    });
    return next(
      new ApiError(403, 'CSRF verification failed: Missing or invalid X-Requested-With header')
    );
  }

  // 2. Validate Origin / Referer header against FRONTEND_URL
  const allowedOrigin = env.FRONTEND_URL.replace(/\/$/, '').toLowerCase();
  const origin = req.headers['origin'];
  const referer = req.headers['referer'];

  let requestOrigin = null;

  if (origin) {
    requestOrigin = origin.replace(/\/$/, '').toLowerCase();
  } else if (referer) {
    try {
      const refUrl = new URL(referer);
      requestOrigin = `${refUrl.protocol}//${refUrl.host}`.toLowerCase();
    } catch {
      requestOrigin = null;
    }
  }

  // In production, Origin or Referer is mandatory for non-GET requests
  if (!requestOrigin) {
    if (env.NODE_ENV === 'production') {
      logger.security('Blocked request missing both Origin and Referer headers', {
        method: req.method,
        path: req.originalUrl,
        ip: req.ip
      });
      return next(new ApiError(403, 'CSRF verification failed: Origin header missing'));
    }
    // In development only, allow tool requests with X-Requested-With
    return next();
  }

  if (requestOrigin !== allowedOrigin) {
    logger.security('CSRF Origin mismatch blocked', {
      expected: allowedOrigin,
      received: requestOrigin,
      ip: req.ip,
      path: req.originalUrl
    });
    return next(new ApiError(403, 'CSRF verification failed: Origin not permitted'));
  }

  next();
};

module.exports = csrfGuard;

