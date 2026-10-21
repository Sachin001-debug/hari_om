
-- Hari Om Real Estate - Database Schema
-- MySQL 8.0+ / MariaDB 10.5+

CREATE DATABASE IF NOT EXISTS hari_om_real_estate
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE hari_om_real_estate;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id VARCHAR(36) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  role ENUM('SUPER_ADMIN', 'ADMIN') NOT NULL DEFAULT 'ADMIN',
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  failedLoginAttempts INT NOT NULL DEFAULT 0,
  lockedUntil DATETIME NULL,
  lastLoginAt DATETIME NULL,
  passwordChangedAt DATETIME NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admins_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Refresh Tokens Table (Rotating session family tracking)
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id VARCHAR(36) NOT NULL,
  adminId VARCHAR(36) NOT NULL,
  tokenHash VARCHAR(64) NOT NULL,
  familyId VARCHAR(36) NOT NULL,
  expiresAt DATETIME NOT NULL,
  revokedAt DATETIME NULL,
  replacedByTokenId VARCHAR(36) NULL,
  userAgent VARCHAR(500) NULL,
  ipAddress VARCHAR(45) NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_refresh_tokens_tokenHash (tokenHash),
  INDEX idx_refresh_tokens_adminId (adminId),
  INDEX idx_refresh_tokens_familyId (familyId),
  CONSTRAINT fk_refresh_tokens_adminId
    FOREIGN KEY (adminId) REFERENCES admins (id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Login Audits Table (Security logging & anomaly detection)
CREATE TABLE IF NOT EXISTS login_audits (
  id VARCHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL,
  adminId VARCHAR(36) NULL,
  success BOOLEAN NOT NULL,
  ipAddress VARCHAR(45) NULL,
  userAgent VARCHAR(500) NULL,
  reason VARCHAR(255) NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_login_audits_email (email),
  INDEX idx_login_audits_adminId (adminId),
  INDEX idx_login_audits_createdAt (createdAt),
  CONSTRAINT fk_login_audits_adminId
    FOREIGN KEY (adminId) REFERENCES admins (id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

