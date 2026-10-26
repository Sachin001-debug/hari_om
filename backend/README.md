# Hari Om Real Estate - Backend API

Production-ready, security-hardened Node.js & Express authentication backend for Hari Om Real Estate Administrator Portal. Built with **Sequelize (v6)**, **MySQL**, and **sequelize-cli**.

---

## Architecture & Security Highlights

- **Sequelize ORM (v6)**: Type-safe, centralized data layer with connection pooling, UTC storage (`+00:00`), safe query logging, and transaction support.
- **Argon2id Hashing**: Industry gold-standard password hashing with memory-hard argon2id parameters.
- **Timing Attack Mitigation**: Automated dummy password verification for non-existent users ensures constant-time responses, defeating user enumeration attacks.
- **Account Lockout**: 5 failed consecutive attempts trigger an atomic counter increment and an automatic 15-minute lockout.
- **Dual Token Rotation & Reuse Detection**:
  - 15-minute short-lived JWT in `httpOnly`, `SameSite=Strict` cookie.
  - 7-day rotating refresh token hashed with SHA-256 before database persistence.
  - Session family tracking with automatic reuse detection: replaying a revoked token invalidates the entire family inside an atomic transaction.
- **CSRF Defense**:
  - `SameSite=Strict` cookies.
  - Custom header requirement (`X-Requested-With: XMLHttpRequest`).
  - Origin / Referer validation against allowed `FRONTEND_URL`.
- **Defense in Depth**:
  - Rate limiting (strict login limiter, refresh limiter, general limiter).
  - Helmet HTTP security headers.
  - 10kb JSON body cap to prevent payload flooding.
  - Zod environment and input validation with `.strict()`.
  - Comprehensive `LoginAudit` tracking with IP and User-Agent telemetry.

---

## Directory Structure

```
backend/
├── .sequelizerc                 # CLI configuration pointing to database paths
├── .env                         # Local environment variables
├── .env.example                 # Example environment template
├── package.json
└── src/
    ├── app.js                   # Express application setup
    ├── server.js                # Server entrypoint with DB authentication & graceful shutdown
    ├── config/
    │   ├── cors.js              # CORS configuration
    │   ├── database.js          # Sequelize & CLI environment configuration
    │   └── env.js               # Zod environment variable validation
    ├── controllers/
    │   └── auth.controller.js   # HTTP controllers
    ├── database/
    │   ├── index.js             # Sequelize instance, model initialization & associations
    │   ├── models/
    │   │   ├── index.js         # Model registry export
    │   │   ├── Admin.js         # Admin model with withSecret scope & password masking
    │   │   ├── RefreshToken.js  # RefreshToken model with tokenHash masking & indexes
    │   │   └── LoginAudit.js    # LoginAudit model & composite indexes
    │   ├── migrations/
    │   │   ├── 20261021000001-create-admins.js
    │   │   ├── 20261021000002-create-refresh-tokens.js
    │   │   └── 20261021000003-create-login-audits.js
    │   └── seeders/
    │       └── 20261021000001-super-admin.js
    ├── middleware/
    ├── routes/
    ├── services/
    ├── utils/
    └── validators/
```

---

## Setup & Running

### 1. Configure Environment
Copy `.env.example` to `.env` and fill in values:
```bash
cp .env.example .env
```

Generate secure 48-byte hex secrets for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### Hosted MySQL (Aiven)
For Aiven MySQL, use the service's connection host, port, database name, username, and password. Enable TLS and verify the server certificate:
```env
DB_SSL=true
DB_SSL_CA_PATH=src/certs/ca.pem
```
Download the CA certificate from the Aiven service console and save it at `backend/src/certs/ca.pem` (or set `DB_SSL_CA_PATH` to another path relative to the `backend` directory). Keep the certificate out of source control. When `DB_SSL=true`, the API requires TLS and validates the server certificate; the server will not start if the CA file cannot be read or the certificate cannot be verified. Production startup also rejects disabled TLS and the root database user.

Check the connection with `npm start` or `npm run db:migrate:status`. The migration-status command may create Sequelize's `SequelizeMeta` bookkeeping table if it does not exist.

### 2. Database Migration & Seeding

#### For Existing Databases:
The versioned migrations are designed to be safe for existing databases previously migrated with `migrate.js`. When run, each migration checks whether the table already exists. If present, it skips table recreation and records the migration in `SequelizeMeta`:
```bash
npm run db:migrate
npm run db:seed
```

#### For Fresh Local Setup (Alternative):
If you prefer a clean slate during local development, drop and recreate the database:
```sql
DROP DATABASE IF EXISTS hari_om_real_estate;
CREATE DATABASE hari_om_real_estate CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```
Then run:
```bash
npm run db:migrate
npm run db:seed
```

### 3. NPM Database Scripts

| Command | Description |
|---|---|
| `npm run db:migrate` | Runs all pending Sequelize migrations |
| `npm run db:migrate:undo` | Reverts the most recent migration |
| `npm run db:migrate:undo:all` | Reverts all migrations back to empty |
| `npm run db:migrate:status` | Displays the status of each migration file (`up` / `down`) |
| `npm run db:seed` | Runs all seeders (idempotent super admin creation) |
| `npm run db:seed:undo` | Reverts all seeders |
| `npm run db:reset` | *(Dev only)* Reverts all migrations, re-migrates, and seeds |
| `npm run db:migration:create -- --name <name>` | Generates a new migration skeleton in `src/database/migrations` |

### 4. Start Server
Development mode (auto-reload with Node `--watch`):
```bash
npm run dev
```

Production mode:
```bash
npm start
```
The server listens on the port configured by `PORT` (default `5000`).

---

## Production Deployment & Database Least-Privilege Users

In production, never use the `root` MySQL user for running the application. Use two separate database users:

### 1. Application Runtime User (Least Privilege)
This user only requires Data Manipulation Language (DML) permissions. It cannot drop tables or alter the database schema:
```sql
CREATE USER 'hariom_app'@'%' IDENTIFIED BY '<SET_A_UNIQUE_STRONG_PASSWORD>';
GRANT SELECT, INSERT, UPDATE, DELETE ON hari_om_real_estate.* TO 'hariom_app'@'%';
FLUSH PRIVILEGES;
```

### 2. Migration User (CI/CD Pipeline Only)
This user requires Data Definition Language (DDL) permissions to run migrations:
```sql
CREATE USER 'hariom_deployer'@'%' IDENTIFIED BY '<SET_A_DIFFERENT_STRONG_PASSWORD>';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER, REFERENCES ON hari_om_real_estate.* TO 'hariom_deployer'@'%';
FLUSH PRIVILEGES;
```

### 3. Production Deployment Commands
```bash
# Render root directory: backend/
# Render build command: npm ci
# Render start command: npm start
# Render health check path: /api/health
# Attach a Render persistent disk at /var/data and set UPLOAD_DIR=/var/data.
#
# Run migrations separately in a controlled release/CI job, using the
# migration-only database user rather than Render runtime credentials:
npm run db:migrate -- --env production

# Seed the administrator only when intentionally provisioning it:
npm run db:seed -- --env production
```

For Vercel, set `frontend/` as the root directory and use `npm run build`. Set `BACKEND_URL` to the HTTPS Render service origin so Next.js proxies `/api/*` and `/uploads/*` through the frontend origin. Keep `NEXT_PUBLIC_API_URL` empty or set it to `/api` so authentication cookies remain same-site. Set backend `FRONTEND_URL` to the exact production Vercel domain. CORS and CSRF checks permit only this exact origin.

Attach a persistent disk to the Render backend service with mount path `/var/data` and set `UPLOAD_DIR=/var/data`. Production startup fails unless this absolute upload directory already exists, preventing uploads from silently falling back to Render's ephemeral filesystem. Back up the disk or move uploads to durable object storage if they need independent retention.

---

## Guide: Adding a New Table Later (e.g. `listings`)

### Step 1: Generate the Migration
```bash
npm run db:migration:create -- --name create-listings
```
This generates a timestamped file in `src/database/migrations/<timestamp>-create-listings.js`. Edit the file with `createTable` and `dropTable`:
```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('listings', {
      id: {
        type: Sequelize.STRING(36),
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      createdByAdminId: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: { model: 'admins', key: 'id' },
        onDelete: 'CASCADE'
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
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('listings');
  }
};
```

### Step 2: Create the Model
Create `src/database/models/Listing.js`:
```javascript
module.exports = (sequelize, DataTypes) => {
  const Listing = sequelize.define('Listing', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false
    },
    createdByAdminId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  }, {
    tableName: 'listings',
    timestamps: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  });

  Listing.associate = (models) => {
    Listing.belongsTo(models.Admin, { foreignKey: 'createdByAdminId', as: 'creator' });
  };

  return Listing;
};
```

### Step 3: Register in `src/database/index.js`
In `src/database/index.js`:
```javascript
const defineListing = require('./models/Listing');
const Listing = defineListing(sequelize, DataTypes);
// Add Listing to models object and exports
```
And add reverse association in `src/database/models/Admin.js`:
```javascript
Admin.associate = (models) => {
  Admin.hasMany(models.Listing, { foreignKey: 'createdByAdminId', as: 'listings' });
};
```

### Step 4: Run Migration
```bash
npm run db:migrate
```
