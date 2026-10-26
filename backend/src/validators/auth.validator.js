const { z } = require('zod');

const loginSchema = z
  .object({
    email: z
      .string({ error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Please provide a valid email address')
      .max(255, 'Email cannot exceed 255 characters'),
    password: z
      .string({ error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password cannot exceed 128 characters')
  })
  .strict();

module.exports = {
  loginSchema
};
