const express = require('express');
const authController = require('../controllers/auth.controller');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { loginLimiter, refreshLimiter } = require('../middleware/rateLimiters');
const { loginSchema } = require('../validators/auth.validator');

const router = express.Router();

// Public auth endpoints with rate limiting and strict schema validation
router.post('/login', loginLimiter, validate(loginSchema), authController.login);
router.post('/refresh', refreshLimiter, authController.refresh);
router.post('/logout', authController.logout);

// Protected endpoint
router.get('/me', authenticate, authController.getMe);

module.exports = router;

