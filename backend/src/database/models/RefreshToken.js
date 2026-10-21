module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define(
    'RefreshToken',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      adminId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'admins',
          key: 'id'
        }
      },
      tokenHash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
      },
      familyId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null
      },
      replacedByTokenId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null
      },
      userAgent: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        defaultValue: null
      }
    },
    {
      tableName: 'refresh_tokens',
      timestamps: true,
      updatedAt: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      indexes: [
        {
          name: 'idx_refresh_tokens_adminId',
          fields: ['adminId']
        },
        {
          name: 'idx_refresh_tokens_familyId',
          fields: ['familyId']
        },
        {
          name: 'idx_refresh_tokens_expiresAt',
          fields: ['expiresAt']
        }
      ]
    }
  );

  RefreshToken.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.tokenHash;
    return values;
  };

  RefreshToken.associate = (models) => {
    RefreshToken.belongsTo(models.Admin, {
      foreignKey: 'adminId',
      as: 'admin',
      onDelete: 'CASCADE'
    });
  };

  return RefreshToken;
};

