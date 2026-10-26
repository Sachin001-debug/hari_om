'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tables = await queryInterface.showAllTables();
    const tableNames = tables.map((t) => (typeof t === 'string' ? t : t.tableName).toLowerCase());

    if (tableNames.includes('properties')) {
      console.log('Skipping createTable for properties: table already exists.');
      return;
    }

    await queryInterface.createTable(
      'properties',
      {
        id: {
          type: Sequelize.STRING(36),
          allowNull: false,
          primaryKey: true
        },
        slug: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true
        },
        title: {
          type: Sequelize.STRING(255),
          allowNull: false
        },
        type: {
          type: Sequelize.ENUM('house', 'plot'),
          allowNull: false,
          defaultValue: 'house'
        },
        price: {
          type: Sequelize.BIGINT,
          allowNull: false
        },
        priceNegotiable: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        city: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        area: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        keywords: {
          type: Sequelize.JSON,
          allowNull: false
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: false
        },
        landAreaValue: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        landAreaUnit: {
          type: Sequelize.STRING(30),
          allowNull: false,
          defaultValue: 'Dhur'
        },
        bedrooms: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null
        },
        bathrooms: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null
        },
        roadWidth: {
          type: Sequelize.STRING(100),
          allowNull: true,
          defaultValue: null
        },
        facing: {
          type: Sequelize.STRING(50),
          allowNull: true,
          defaultValue: null
        },
        legalStatus: {
          type: Sequelize.STRING(255),
          allowNull: true,
          defaultValue: 'Freehold (Lalpurja verified)'
        },
        waterSupply: {
          type: Sequelize.STRING(255),
          allowNull: true,
          defaultValue: 'Deep boring & municipal line'
        },
        electricity: {
          type: Sequelize.STRING(255),
          allowNull: true,
          defaultValue: 'NEA 3-phase connection'
        },
        parking: {
          type: Sequelize.STRING(255),
          allowNull: true,
          defaultValue: null
        },
        construction: {
          type: Sequelize.STRING(255),
          allowNull: true,
          defaultValue: null
        },
        image: {
          type: Sequelize.STRING(500),
          allowNull: false
        },
        images: {
          type: Sequelize.JSON,
          allowNull: false
        },
        featured: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        status: {
          type: Sequelize.ENUM('PUBLISHED', 'DRAFT', 'ARCHIVED'),
          allowNull: false,
          defaultValue: 'PUBLISHED'
        },
        createdBy: {
          type: Sequelize.STRING(36),
          allowNull: true,
          references: {
            model: 'admins',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
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

    // Create Indexes
    await queryInterface.addIndex('properties', ['slug'], {
      unique: true,
      name: 'idx_properties_slug'
    });
    await queryInterface.addIndex('properties', ['city'], {
      name: 'idx_properties_city'
    });
    await queryInterface.addIndex('properties', ['type'], {
      name: 'idx_properties_type'
    });
    await queryInterface.addIndex('properties', ['status'], {
      name: 'idx_properties_status'
    });
    await queryInterface.addIndex('properties', ['featured'], {
      name: 'idx_properties_featured'
    });
    await queryInterface.addIndex('properties', ['createdAt'], {
      name: 'idx_properties_created_at'
    });
  },

  down: async (queryInterface, Sequelize) => {
    const tables = await queryInterface.showAllTables();
    const tableNames = tables.map((t) => (typeof t === 'string' ? t : t.tableName).toLowerCase());

    if (tableNames.includes('properties')) {
      await queryInterface.dropTable('properties');
    }
  }
};

