const path = require('path');
const dotenv = require('dotenv');
const { z } = require('zod');

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const emptyToUndefined = (value) => (
  typeof value === 'string' && value.trim() === '' ? undefined : value
);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().int().positive().default(5000),
  FRONTEND_URL: z.preprocess(emptyToUndefined, z.string().url()),
  BACKEND_URL: z.preprocess(emptyToUndefined, z.string().url()),

  UPLOAD_DIR: z.string().default('uploads'),
  MAX_FILE_SIZE_BYTES: z.coerce.number().int().positive().default(5 * 1024 * 1024),

  DB_HOST: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  DB_PORT: z.preprocess(emptyToUndefined, z.coerce.number().int().positive().optional()),
  DB_USER: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  DB_PASSWORD: z.preprocess(emptyToUndefined, z.string().optional()),
  DB_NAME: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  DB_SSL: z
    .preprocess((val) => {
      if (typeof val === 'string') {
        return val.toLowerCase() === 'true' || val === '1';
      }
      return Boolean(val);
    }, z.boolean())
    .default(false),
  DB_SSL_CA_PATH: z.preprocess(emptyToUndefined, z.string().optional()),
  DATABASE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  DB_NAME_TEST: z.preprocess(emptyToUndefined, z.string().min(1).optional()),

  JWT_ACCESS_SECRET: z
    .string({ error: 'JWT_ACCESS_SECRET is required' })
    .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters long for security'),

  JWT_REFRESH_SECRET: z
    .string({ error: 'JWT_REFRESH_SECRET is required' })
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters long for security'),

  ADMIN_NAME: z.preprocess(emptyToUndefined, z.string().optional()),
  ADMIN_EMAIL: z.preprocess(emptyToUndefined, z.string().email().optional()),
  ADMIN_PASSWORD: z.preprocess(emptyToUndefined, z.string().optional())
}).superRefine((config, context) => {
  if (!config.DATABASE_URL && (!config.DB_HOST || !config.DB_PORT || !config.DB_USER || !config.DB_NAME)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['DATABASE_URL'],
      message: 'Set DATABASE_URL or provide DB_HOST, DB_PORT, DB_USER, and DB_NAME.'
    });
  }

  if (config.NODE_ENV === 'test') {
    if (!config.DB_NAME_TEST) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['DB_NAME_TEST'],
        message: 'Set a dedicated DB_NAME_TEST before running tests.'
      });
    }

    let primaryDatabase = config.DB_NAME;
    if (config.DATABASE_URL) {
      try {
        primaryDatabase = decodeURIComponent(new URL(config.DATABASE_URL).pathname.replace(/^\//, ''));
      } catch {
        primaryDatabase = undefined;
      }
    }

    if (config.DB_NAME_TEST && primaryDatabase && config.DB_NAME_TEST === primaryDatabase) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['DB_NAME_TEST'],
        message: 'DB_NAME_TEST must be different from the application database.'
      });
    }
  }

  if (config.NODE_ENV !== 'production') return;

  if (!config.DB_SSL) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['DB_SSL'],
      message: 'DB_SSL must be true in production.'
    });
  }

  if (!config.FRONTEND_URL?.startsWith('https://') || !config.BACKEND_URL?.startsWith('https://')) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['FRONTEND_URL'],
      message: 'FRONTEND_URL and BACKEND_URL must use HTTPS in production.'
    });
  }

  let databaseUser = config.DB_USER;
  if (config.DATABASE_URL) {
    try {
      databaseUser = decodeURIComponent(new URL(config.DATABASE_URL).username);
    } catch {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['DATABASE_URL'],
        message: 'DATABASE_URL must contain a valid encoded username.'
      });
    }
  }

  if (!databaseUser || databaseUser.toLowerCase() === 'root') {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['DB_USER'],
      message: 'Configure a dedicated non-root database user in production.'
    });
  }
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
