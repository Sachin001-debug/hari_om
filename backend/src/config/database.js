const fs = require('fs');
const path = require('path');
const env = require('./env');

const getDialectOptions = () => {
  const options = {};

  if (env.DB_SSL) {
    const ssl = {
      require: true,
      rejectUnauthorized: true
    };
    if (env.DB_SSL_CA_PATH) {
      const configuredCaPath = path.resolve(__dirname, '../..', env.DB_SSL_CA_PATH);
      const renderCaPath = '/etc/secrets/ca.pem';
      const caPaths = env.NODE_ENV === 'production'
        ? [configuredCaPath, renderCaPath].filter((caPath, index, paths) => paths.indexOf(caPath) === index)
        : [configuredCaPath];
      let lastError;

      for (const caPath of caPaths) {
        try {
          const caStats = fs.statSync(caPath);
          if (!caStats.isFile()) {
            throw new Error('Configured CA path is not a file.');
          }
          ssl.ca = fs.readFileSync(caPath);
          break;
        } catch (error) {
          lastError = error;
        }
      }

      if (!ssl.ca) {
        throw new Error(
          `Unable to read the database CA certificate. Check DB_SSL_CA_PATH. On Render, add the CA as a Secret File named ca.pem; it is available at /etc/secrets/ca.pem.`,
          { cause: lastError }
        );
      }
    }
    options.ssl = ssl;
  }

  return options;
};

// Safe query logger for development: masks sensitive hashes/passwords
const safeQueryLogger = (sql) => {
  if (typeof sql === 'string') {
    const sanitized = sql.replace(
      /(passwordHash|password|tokenHash|rawRefreshToken)\s*(=|:)\s*('[^']+'|"[^"]+"|\S+)/gi,
      '$1 $2 [REDACTED]'
    );
    console.log(`[Sequelize] ${sanitized}`);
  } else {
    console.log('[Sequelize] executing query');
  }
};

let host = env.DB_HOST;
let port = Number(env.DB_PORT) || 3306;
let username = env.DB_USER;
let password = env.DB_PASSWORD;
let database = env.DB_NAME;

if (env.DATABASE_URL) {
  const parsed = new URL(env.DATABASE_URL);
  host = parsed.hostname;
  port = parsed.port ? parseInt(parsed.port, 10) : 3306;
  username = decodeURIComponent(parsed.username);
  password = decodeURIComponent(parsed.password);
  database = parsed.pathname.replace(/^\//, '');
}

const baseConfig = {
  username,
  password,
  database,
  host,
  port,
  dialect: 'mysql',
  timezone: '+00:00',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    timestamps: true
  },
  dialectOptions: getDialectOptions()
};

module.exports = {
  development: {
    ...baseConfig,
    logging: safeQueryLogger
  },
  test: {
    ...baseConfig,
    database: env.DB_NAME_TEST,
    logging: false
  },
  production: {
    ...baseConfig,
    logging: false
  }
};
