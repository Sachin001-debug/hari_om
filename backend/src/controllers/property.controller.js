'use strict';

const propertyService = require('../services/property.service');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const propertyController = {
  createProperty: asyncHandler(async (req, res, next) => {
    logger.info('Received property creation request', {
      adminId: req.admin?.id,
      title: req.body?.title,
      type: req.body?.type,
      ip: req.ip
    });

    if (!req.file) {
      return next(new ApiError(400, 'Property image is required.'));
    }

    try {
      const property = await propertyService.createProperty(req.body, req.admin.id, req.file);

      res.status(201).json({
        success: true,
        message: 'Property listing created successfully.',
        property: property.toJSON()
      });
    } catch (err) {
      if (req.file && typeof req.file.cleanup === 'function') {
        await req.file.cleanup();
      }
      next(err);
    }
  }),

  getAllPublished: asyncHandler(async (req, res) => {
    const properties = await propertyService.getPublishedProperties(req.query);
    res.status(200).json({
      success: true,
      count: properties.length,
      properties: properties.map((p) => p.toJSON())
    });
  }),

  getAllAdmin: asyncHandler(async (req, res) => {
    const result = await propertyService.getAdminProperties(req.query);
    res.status(200).json({
      success: true,
      properties: result.properties.map((property) => property.toJSON()),
      pagination: result.pagination
    });
  }),

  deleteProperty: asyncHandler(async (req, res, next) => {
    const deleted = await propertyService.deleteProperty(req.params.id);
    if (!deleted) {
      return next(new ApiError(404, `Property with identifier "${req.params.id}" not found.`));
    }

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully.'
    });
  }),

  getBySlugOrId: asyncHandler(async (req, res, next) => {
    const { slugOrId } = req.params;
    const property = await propertyService.getPropertyBySlugOrId(slugOrId);

    if (!property) {
      return next(new ApiError(404, `Property with identifier "${slugOrId}" not found.`));
    }

    res.status(200).json({
      success: true,
      property: property.toJSON()
    });
  }),

  getFeatured: asyncHandler(async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 4;
    const properties = await propertyService.getFeaturedProperties(limit);

    res.status(200).json({
      success: true,
      count: properties.length,
      properties: properties.map((p) => p.toJSON())
    });
  }),

  getStats: asyncHandler(async (req, res) => {
    const stats = await propertyService.getStats();
    res.status(200).json({
      success: true,
      stats
    });
  })
};

module.exports = propertyController;
