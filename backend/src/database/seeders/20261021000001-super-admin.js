'use strict';

const crypto = require('crypto');
const env = require('../../config/env');
const { hashPassword, validatePasswordStrength } = require('../../services/password.service');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const name = (env.ADMIN_NAME || process.env.ADMIN_NAME || '').trim();
    const email = (env.ADMIN_EMAIL || process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    const password = env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || '';

    // 1. Validate required environment variables exist
    if (!name || !email || !password) {
      throw new Error(
        'SEEDER ERROR: Missing required seed credentials (ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD) in environment.'
      );
    }

    // 2. Validate password strength
    const strengthCheck = validatePasswordStrength(password);
    if (!strengthCheck.isValid) {
      throw new Error(
        `SEEDER ERROR: ADMIN_PASSWORD does not meet the strict security criteria:\n${strengthCheck.errors.map((err) => `  - ${err}`).join('\n')}`
      );
    }

    // 3. Hash password using argon2id
    console.log('[Seeder] Generating argon2id hash for Super Admin password...');
    const passwordHash = await hashPassword(password);
    const now = new Date();

    // 4. Idempotent check
    const [existingRows] = await queryInterface.sequelize.query(
      'SELECT id, email FROM admins WHERE email = :email LIMIT 1',
      {
        replacements: { email },
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    );

    if (existingRows) {
      await queryInterface.bulkUpdate(
        'admins',
        {
          name,
          passwordHash,
          role: 'SUPER_ADMIN',
          isActive: true,
          failedLoginAttempts: 0,
          lockedUntil: null,
          passwordChangedAt: now,
          updatedAt: now
        },
        { email }
      );
      console.log(`[Seeder] Existing Super Admin [${email}] updated with new credentials.`);
    } else {
      const newAdminId = crypto.randomUUID();
      await queryInterface.bulkInsert('admins', [
        {
          id: newAdminId,
          name,
          email,
          passwordHash,
          role: 'SUPER_ADMIN',
          isActive: true,
          failedLoginAttempts: 0,
          lockedUntil: null,
          passwordChangedAt: now,
          createdAt: now,
          updatedAt: now
        }
      ]);
      console.log(`[Seeder] New Super Admin [${email}] created successfully.`);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const email = (env.ADMIN_EMAIL || process.env.ADMIN_EMAIL || '').toLowerCase().trim();
    if (email) {
      await queryInterface.bulkDelete('admins', { email });
      console.log(`[Seeder] Seeded Super Admin [${email}] removed.`);
    }
  }
};

