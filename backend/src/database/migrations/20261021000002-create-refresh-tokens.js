'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = await queryInterface.showAllTables();
    const tableNames = tables.map((t) => (typeof t === 'string' ? t : t.tableName).toLowerCase());

    if (tableNames.includes('refresh_tokens')) {
      console.log('Skipping createTable for refresh_tokens: table already exists.');
      return;
    }

    await queryInterface.createTable(
      'refresh_tokens',
      {
        id: {
          type: Sequelize.STRING(36),
          allowNull: false,
          primaryKey: true
        },
        adminId: {
          type: Sequelize.STRING(36),
          allowNull: false,
          references: {
            model: 'admins',
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        tokenHash: {
          type: Sequelize.STRING(64),
          allowNull: false,
          unique: true
        },
        familyId: {
          type: Sequelize.STRING(36),
          allowNull: false
        },
        expiresAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        revokedAt: {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null
        },
        replacedByTokenId: {
          type: Sequelize.STRING(36),
          allowNull: true,
          defaultValue: null
        },
        userAgent: {
          type: Sequelize.STRING(500),
          allowNull: true,
          defaultValue: null
        },
        ipAddress: {
          type: Sequelize.STRING(45),
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

    await queryInterface.addIndex('refresh_tokens', ['adminId'], {
      name: 'idx_refresh_tokens_adminId'
    });
    await queryInterface.addIndex('refresh_tokens', ['familyId'], {
      name: 'idx_refresh_tokens_familyId'
    });
    await queryInterface.addIndex('refresh_tokens', ['expiresAt'], {
      name: 'idx_refresh_tokens_expiresAt'
    });
  },

  down: async (queryInterface, Sequelize) => {
    const tables = await queryInterface.showAllTables();
    const tableNames = tables.map((t) => (typeof t === 'string' ? t : t.tableName).toLowerCase());

    if (tableNames.includes('refresh_tokens')) {
      await queryInterface.dropTable('refresh_tokens');
    }
  }
};

