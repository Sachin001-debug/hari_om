'use strict';

const express = require('express');
const propertyController = require('../controllers/property.controller');
const authenticate = require('../middleware/authenticate');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const uploadImage = require('../middleware/uploadImage');
const validate = require('../middleware/validate');
const { propertyCreationLimiter } = require('../middleware/rateLimiters');
const { createPropertySchema } = require('../validators/property.validator');

const router = express.Router();

// Public routes for website integration
router.get('/admin', authenticate, authorizeAdmin, propertyController.getAllAdmin);
router.get('/', propertyController.getAllPublished);
router.get('/featured', propertyController.getFeatured);
router.get('/stats', authenticate, authorizeAdmin, propertyController.getStats);
router.delete('/:id', authenticate, authorizeAdmin, propertyController.deleteProperty);
router.get('/:slugOrId', propertyController.getBySlugOrId);

// Protected admin route for secure property creation
router.post(
  '/',
  authenticate,
  authorizeAdmin,
  propertyCreationLimiter,
  uploadImage,
  validate(createPropertySchema),
  propertyController.createProperty
);

module.exports = router;
