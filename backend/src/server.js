const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./database');
const logger = require('./utils/logger');

let server;

const startServer = async () => {
  try {
    // Authenticate database connection before accepting HTTP requests
    await sequelize.authenticate();
    logger.info('Database connection established successfully via Sequelize.');

    server = app.listen(env.PORT, () => {
      logger.info(`🚀 Hari Om Real Estate Auth Server running on port ${env.PORT} [${env.NODE_ENV}]`);
      logger.info(`🔒 Allowed Frontend Origin: ${env.FRONTEND_URL}`);
    });
  } catch (err) {
    logger.error('❌ Failed to connect to the database. Server startup aborted.', err);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  logger.warn(`Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');

      try {
        await sequelize.close();
        logger.info('Sequelize database connection closed successfully.');
        process.exit(0);
      } catch (err) {
        logger.error('Error during database disconnection:', err);
        process.exit(1);
      }
    });
  } else {
    try {
      await sequelize.close();
    } catch (err) {
      logger.error('Error during database disconnection:', err);
    }
    process.exit(0);
  }

  // Force shutdown after 10 seconds timeout
  setTimeout(() => {
    logger.error('Graceful shutdown timed out. Forcing process exit.');
    process.exit(1);
  }, 10000).unref();
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception thrown:', err);
  gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection:', reason);
  gracefulShutdown('unhandledRejection');
});

startServer();
