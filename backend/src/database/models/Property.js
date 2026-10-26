'use strict';

module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define(
    'Property',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM('house', 'plot'),
        allowNull: false,
        defaultValue: 'house'
      },
      price: {
        type: DataTypes.BIGINT,
        allowNull: false,
        get() {
          const raw = this.getDataValue('price');
          return raw !== null && raw !== undefined ? Number(raw) : null;
        }
      },
      priceNegotiable: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      area: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      keywords: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        get() {
          const raw = this.getDataValue('keywords');
          if (Array.isArray(raw)) return raw;
          if (typeof raw === 'string') {
            try {
              return JSON.parse(raw);
            } catch {
              return [];
            }
          }
          return [];
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      landAreaValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        get() {
          const raw = this.getDataValue('landAreaValue');
          return raw !== null && raw !== undefined ? Number(raw) : null;
        }
      },
      landAreaUnit: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: 'Dhur'
      },
      bedrooms: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      bathrooms: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      roadWidth: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: null
      },
      facing: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null
      },
      legalStatus: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: 'Freehold (Lalpurja verified)'
      },
      waterSupply: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: 'Deep boring & municipal line'
      },
      electricity: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: 'NEA 3-phase connection'
      },
      parking: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      construction: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      image: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      images: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
        get() {
          const raw = this.getDataValue('images');
          if (Array.isArray(raw)) return raw;
          if (typeof raw === 'string') {
            try {
              return JSON.parse(raw);
            } catch {
              return [];
            }
          }
          return [];
        }
      },
      featured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      status: {
        type: DataTypes.ENUM('PUBLISHED', 'DRAFT', 'ARCHIVED'),
        allowNull: false,
        defaultValue: 'PUBLISHED'
      },
      createdBy: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    {
      tableName: 'properties',
      timestamps: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    }
  );

  Property.prototype.toJSON = function () {
    const values = { ...this.get() };
    const landValue = values.landAreaValue !== null && values.landAreaValue !== undefined ? Number(values.landAreaValue) : null;
    values.landArea = {
      value: landValue,
      unit: values.landAreaUnit || 'Dhur'
    };
    values.price = values.price !== null && values.price !== undefined ? Number(values.price) : null;
    if (typeof values.keywords === 'string') {
      try {
        values.keywords = JSON.parse(values.keywords);
      } catch {
        values.keywords = [];
      }
    }
    if (typeof values.images === 'string') {
      try {
        values.images = JSON.parse(values.images);
      } catch {
        values.images = [];
      }
    }
    if (values.createdAt instanceof Date) {
      values.createdAt = values.createdAt.toISOString().slice(0, 10);
    }
    return values;
  };

  Property.associate = (models) => {
    Property.belongsTo(models.Admin, {
      foreignKey: 'createdBy',
      as: 'creator',
      onDelete: 'SET NULL'
    });
  };

  return Property;
};

