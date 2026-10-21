const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),

  DB_HOST: z.string().min(1).default('127.0.0.1'),
  DB_PORT: z.coerce.number().int().positive().default(3307),
  DB_USER: z.string().default('root'),
  DB_PASSWORD: z.string().default(''),
  DB_NAME: z.string().min(1).default('hari_om_real_estate'),
  DB_SSL: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        return val.toLowerCase() === 'true' || val === '1';
      }
      return Boolean(val);
    }, z.boolean())
    .default(false),
  DATABASE_URL: z.string().optional(),

  JWT_ACCESS_SECRET: z
    .string({
      required_error: 'JWT_ACCESS_SECRET is required'
    })
    .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters long for security'),

  JWT_REFRESH_SECRET: z
    .string({
      required_error: 'JWT_REFRESH_SECRET is required'
    })
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters long for security'),

  ADMIN_NAME: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().optional()
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('\n❌ FATAL: Invalid environment configuration:');
  const formatted = result.error.format();
  for (const [key, value] of Object.entries(formatted)) {
    if (key === '_errors') continue;
    if (value && value._errors && value._errors.length > 0) {
      console.error(`  - ${key}: ${value._errors.join(', ')}`);
    }
  }
  console.error('\nPlease check your backend/.env file and restart.\n');
  process.exit(1);
}

module.exports = result.data;

