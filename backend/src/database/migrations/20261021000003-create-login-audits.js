'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = await queryInterface.showAllTables();
    const tableNames = tables.map((t) => (typeof t === 'string' ? t : t.tableName).toLowerCase());

    if (tableNames.includes('login_audits')) {
      console.log('Skipping createTable for login_audits: table already exists.');
      return;
    }

    await queryInterface.createTable(
      'login_audits',
      {
        id: {
          type: Sequelize.STRING(36),
          allowNull: false,
          primaryKey: true
        },
        email: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        adminId: {
          type: Sequelize.STRING(36),
          allowNull: true,
          defaultValue: null,
          references: {
            model: 'admins',
            key: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        },
        success: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        },
        ipAddress: {
          type: Sequelize.STRING(45),
          allowNull: true,
          defaultValue: null
        },
        userAgent: {
          type: Sequelize.STRING(500),
          allowNull: true,
          defaultValue: null
        },
        reason: {
          type: Sequelize.STRING(255),
          allowNull: true,
          defaultValue: null
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
      },
      {
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
      }
    );

    await queryInterface.addIndex('login_audits', ['email'], {
      name: 'idx_login_audits_email'
    });
    await queryInterface.addIndex('login_audits', ['adminId'], {
      name: 'idx_login_audits_adminId'
    });
    await queryInterface.addIndex('login_audits', ['createdAt'], {
      name: 'idx_login_audits_createdAt'
    });
    await queryInterface.addIndex('login_audits', ['email', 'createdAt'], {
      name: 'idx_login_audits_email_createdAt'
    });
  },

  down: async (queryInterface, Sequelize) => {
    const tables = await queryInterface.showAllTables();
    const tableNames = tables.map((t) => (typeof t === 'string' ? t : t.tableName).toLowerCase());

    if (tableNames.includes('login_audits')) {
      await queryInterface.dropTable('login_audits');
    }
  }
};

