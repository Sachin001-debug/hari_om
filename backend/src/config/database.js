const env = require('./env');

const getDialectOptions = () => {
  const options = {};

  if (env.DB_SSL) {
    options.ssl = {
      require: true,
      rejectUnauthorized: false
    };
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
let port = Number(env.DB_PORT) || 3307;
let username = env.DB_USER;
let password = env.DB_PASSWORD;
let database = env.DB_NAME;

if (env.DATABASE_URL) {
  try {
    const parsed = new URL(env.DATABASE_URL);
    host = parsed.hostname;
    port = parsed.port ? parseInt(parsed.port, 10) : 3306;
    username = decodeURIComponent(parsed.username || 'root');
    password = decodeURIComponent(parsed.password || '');
    database = parsed.pathname ? parsed.pathname.replace(/^\//, '') : env.DB_NAME;
  } catch {
    // Fall back to discrete DB_* settings
  }
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
    database: process.env.DB_NAME_TEST || `${database}_test`,
    logging: false
  },
  production: {
    ...baseConfig,
    logging: false
  }
};

