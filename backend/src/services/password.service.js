const argon2 = require('argon2');

// Constant dummy hash used for constant-time comparisons when email is not found
// Prevents user enumeration via timing attack
let dummyHashCache = null;

const getDummyHash = async () => {
  if (!dummyHashCache) {
    dummyHashCache = await argon2.hash('DummyConstantTimingPassword!2026', {
      type: argon2.argon2id
    });
  }
  return dummyHashCache;
};

// Eagerly initialize the dummy hash on startup
getDummyHash().catch(() => {});

const hashPassword = async (password) => {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4
  });
};

const verifyPassword = async (hash, password) => {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
};

const verifyDummyPassword = async (password) => {
  try {
    const dummy = await getDummyHash();
    await argon2.verify(dummy, password);
  } catch {
    // Expected to fail or return false
  }
  return false;
};

const validatePasswordStrength = (password) => {
  const minLength = 12;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const errors = [];
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (!hasUpper) errors.push('Password must contain at least one uppercase letter');
  if (!hasLower) errors.push('Password must contain at least one lowercase letter');
  if (!hasNumber) errors.push('Password must contain at least one number');
  if (!hasSymbol) errors.push('Password must contain at least one special character');

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  hashPassword,
  verifyPassword,
  verifyDummyPassword,
  validatePasswordStrength
};

