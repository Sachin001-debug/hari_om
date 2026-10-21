'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = await queryInterface.showAllTables();
    const tableNames = tables.map((t) => (typeof t === 'string' ? t : t.tableName).toLowerCase());

    if (tableNames.includes('admins')) {
      console.log('Skipping createTable for admins: table already exists.');
      return;
    }

    await queryInterface.createTable(
      'admins',
      {
        id: {
          type: Sequelize.STRING(36),
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        passwordHash: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        role: {
          type: Sequelize.ENUM('SUPER_ADMIN', 'ADMIN'),
          allowNull: false,
          defaultValue: 'ADMIN'
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true
        },
        failedLoginAttempts: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        lockedUntil: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null
        },
        lastLoginAt: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null
        },
        passwordChangedAt: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    const tables = await queryInterface.showAllTables();
    const tableNames = tables.map((t) => (typeof t === 'string' ? t : t.tableName).toLowerCase());

    if (tableNames.includes('admins')) {
      await queryInterface.dropTable('admins');
    }
  }
};

