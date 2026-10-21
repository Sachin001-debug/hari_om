const env = require('./env');

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server) in development
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigin = env.FRONTEND_URL.replace(/\/$/, '');
    const incomingOrigin = origin.replace(/\/$/, '');

    if (incomingOrigin === allowedOrigin) {
      return callback(null, true);
    }

    return callback(new Error(`CORS error: Origin ${origin} not allowed by policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400
};

module.exports = corsOptions;

