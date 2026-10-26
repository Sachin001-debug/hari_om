const express = require('express');
const path = require('path');
const crypto = require('crypto');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const morgan = require('morgan');

const env = require('./config/env');
const corsOptions = require('./config/cors');
const routes = require('./routes');
const csrfGuard = require('./middleware/csrfGuard');
const { generalApiLimiter } = require('./middleware/rateLimiters');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Trust reverse proxy for secure cookie validation and rate limit tracking (e.g. Nginx, Cloudflare, Vercel)
app.set('trust proxy', 1);

// Disable X-Powered-By header
app.disable('x-powered-by');

// Assign unique request ID for structured logging and traceability
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-Id', req.id);
  next();
});

// Strict HTTP security headers with Helmet
app.use(
  helmet({
    hidePoweredBy: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        frameAncestors: ["'none'"]
      }
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  })
);

// Strict CORS Allowlist
app.use(cors(corsOptions));

// HTTP Request logging
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing with strict payload limits (prevents payload flood & hash DoS)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false, limit: '10kb' }));

// Cookie parser for httpOnly session cookies
app.use(cookieParser());

// Response compression
app.use(compression());

// Safe static image serving with security headers
const uploadsPath = path.resolve(__dirname, '..', env.UPLOAD_DIR);
app.use(
  '/uploads',
  express.static(uploadsPath, {
    dotfiles: 'ignore',
    etag: true,
    index: false,
    maxAge: '7d',
    setHeaders: (res) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
  })
);

// General rate limiter on all API routes
app.use('/api', generalApiLimiter);

// CSRF defence for non-GET state-modifying requests
app.use('/api', csrfGuard);

// API router
app.use('/api', routes);

// 404 handler
app.use(notFound);

// Centralized error handler
app.use(errorHandler);

module.exports = app;
