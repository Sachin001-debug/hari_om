const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const dbConfig = require('../config/database');

const currentEnv = env.NODE_ENV || 'development';
const config = dbConfig[currentEnv] || dbConfig.development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  ...config,
  logging: config.logging
});

// Import model definitions
const defineAdmin = require('./models/Admin');
const defineRefreshToken = require('./models/RefreshToken');
const defineLoginAudit = require('./models/LoginAudit');

// Initialize models
const Admin = defineAdmin(sequelize, DataTypes);
const RefreshToken = defineRefreshToken(sequelize, DataTypes);
const LoginAudit = defineLoginAudit(sequelize, DataTypes);

const models = {
  Admin,
  RefreshToken,
  LoginAudit
};

// Establish associations
Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  models,
  Admin,
  RefreshToken,
  LoginAudit
};

