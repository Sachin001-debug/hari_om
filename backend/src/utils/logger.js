const env = require('../config/env');

const SENSITIVE_KEYS = ['password', 'passwordhash', 'token', 'secret', 'authorization', 'cookie', 'refresh_token', 'access_token'];

function maskSensitiveData(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(maskSensitiveData);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = '***REDACTED***';
    } else if (value && typeof value === 'object') {
      sanitized[key] = maskSensitiveData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

const logger = {
  info: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] ${message}`, Object.keys(meta).length ? maskSensitiveData(meta) : '');
  },

  warn: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] ${message}`, Object.keys(meta).length ? maskSensitiveData(meta) : '');
  },

  security: (message, meta = {}) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [SECURITY_ALERT] ${message}`, Object.keys(meta).length ? maskSensitiveData(meta) : '');
  },

  error: (message, error = null, meta = {}) => {
    const timestamp = new Date().toISOString();
    const errorDetails = error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: env.NODE_ENV === 'development' ? error.stack : undefined
        }
      : error;

    console.error(`[${timestamp}] [ERROR] ${message}`, {
      ...maskSensitiveData(meta),
      error: errorDetails
    });
  }
};

module.exports = logger;

