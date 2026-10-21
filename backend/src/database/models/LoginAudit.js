module.exports = (sequelize, DataTypes) => {
  const LoginAudit = sequelize.define(
    'LoginAudit',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      adminId: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
        references: {
          model: 'admins',
          key: 'id'
        }
      },
      success: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        defaultValue: null
      },
      userAgent: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null
      },
      reason: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: null
      }
    },
    {
      tableName: 'login_audits',
      timestamps: true,
      updatedAt: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      indexes: [
        {
          name: 'idx_login_audits_email',
          fields: ['email']
        },
        {
          name: 'idx_login_audits_adminId',
          fields: ['adminId']
        },
        {
          name: 'idx_login_audits_createdAt',
          fields: ['createdAt']
        },
        {
          name: 'idx_login_audits_email_createdAt',
          fields: ['email', 'createdAt']
        }
      ]
    }
  );

  LoginAudit.associate = (models) => {
    LoginAudit.belongsTo(models.Admin, {
      foreignKey: 'adminId',
      as: 'admin',
      onDelete: 'SET NULL'
    });
  };

  return LoginAudit;
};

