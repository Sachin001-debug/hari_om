const rateLimit = require('express-rate-limit');

// Strict limiter for authentication login endpoint
// 5 attempts per 15 minutes per IP + email combination
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  keyGenerator: (req) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const email = (req.body && typeof req.body.email === 'string')
      ? req.body.email.toLowerCase().trim()
      : 'no-email';
    return `login_${ip}_${email}`;
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. For security reasons, please try again in 15 minutes.'
    });
  }
});

// Moderate limiter for refresh token endpoint
// 30 requests per 15 minutes per IP
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many session refresh requests. Please slow down.'
    });
  }
});

// General API limiter for all endpoints
// 300 requests per 15 minutes per IP
const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  },
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Rate limit exceeded. Please try again later.'
    });
  }
});

module.exports = {
  loginLimiter,
  refreshLimiter,
  generalApiLimiter
};

