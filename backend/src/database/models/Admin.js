module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    'Admin',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        set(val) {
          this.setDataValue('email', val ? val.toLowerCase().trim() : val);
        },
        validate: {
          isEmail: {
            msg: 'Invalid email address format'
          }
        }
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('SUPER_ADMIN', 'ADMIN'),
        allowNull: false,
        defaultValue: 'ADMIN'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      failedLoginAttempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      lockedUntil: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      lastLoginAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      passwordChangedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      }
    },
    {
      tableName: 'admins',
      timestamps: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      defaultScope: {
        attributes: { exclude: ['passwordHash'] }
      },
      scopes: {
        withSecret: {
          attributes: { exclude: [] }
        }
      }
    }
  );

  Admin.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.passwordHash;
    return values;
  };

  Admin.associate = (models) => {
    Admin.hasMany(models.RefreshToken, {
      foreignKey: 'adminId',
      as: 'refreshTokens',
      onDelete: 'CASCADE'
    });
    Admin.hasMany(models.LoginAudit, {
      foreignKey: 'adminId',
      as: 'loginAudits',
      onDelete: 'SET NULL'
    });
    Admin.hasMany(models.Property, {
      foreignKey: 'createdBy',
      as: 'properties',
      onDelete: 'SET NULL'
    });
  };

  return Admin;
};

