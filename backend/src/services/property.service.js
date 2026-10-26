'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const { Property, Admin } = require('../database');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

function generateSlug(title, area, city) {
  const parts = [title, area, city].filter(Boolean).join(' ');
  const slug = parts
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || `property-${crypto.randomBytes(4).toString('hex')}`;
}

const propertyService = {
  /**
   * Create a new property with associated uploaded image
   */
  createProperty: async (data, adminId, file) => {
    let baseSlug = generateSlug(data.title, data.area, data.city);
    let slug = baseSlug;
    let counter = 1;

    // Guarantee unique slug
    while (await Property.findOne({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const isHouse = data.type === 'house';
    const createdAtDate = data.createdAt ? new Date(data.createdAt) : new Date();

    const payload = {
      id: crypto.randomUUID(),
      slug,
      title: data.title,
      type: data.type,
      price: data.price,
      priceNegotiable: Boolean(data.priceNegotiable),
      city: data.city,
      area: data.area,
      keywords: data.keywords || [],
      description: data.description,
      landAreaValue: data.landAreaValue,
      landAreaUnit: data.landAreaUnit || 'Dhur',
      bedrooms: isHouse ? data.bedrooms : null,
      bathrooms: isHouse ? data.bathrooms : null,
      roadWidth: data.roadWidth || '20 ft pitched',
      facing: data.facing || 'East',
      legalStatus: data.legalStatus || 'Freehold (Lalpurja verified)',
      waterSupply: data.waterSupply || 'Deep boring & municipal line',
      electricity: data.electricity || 'NEA 3-phase connection',
      parking: isHouse ? (data.parking || 'Covered garage (2 cars)') : null,
      construction: isHouse ? (data.construction || 'Earthquake-resistant RCC frame') : null,
      image: file.storedUrl,
      images: [],
      featured: Boolean(data.featured),
      status: data.status || 'PUBLISHED',
      createdBy: adminId,
      createdAt: createdAtDate,
      updatedAt: createdAtDate
    };

    try {
      const created = await Property.create(payload);
      logger.info('Property successfully created and persisted', {
        propertyId: created.id,
        slug: created.slug,
        adminId
      });
      return created;
    } catch (dbError) {
      // Clean up uploaded image if database insert fails
      if (file && typeof file.cleanup === 'function') {
        await file.cleanup();
      }
      logger.error('Failed to save property to database', dbError, {
        adminId,
        slug
      });
      throw dbError;
    }
  },

  /**
   * Fetch all published properties with optional filtering
   */
  getPublishedProperties: async (filters = {}, options = {}) => {
    const where = {
      status: 'PUBLISHED'
    };

    // City filter
    if (filters.city && filters.city.toLowerCase() !== 'all') {
      where.city = { [Op.like]: filters.city.trim() };
    }

    // Property type
    if (filters.type && filters.type.toLowerCase() !== 'all') {
      where.type = filters.type.toLowerCase().trim();
    }

    // Price range
    if (filters.minPrice && filters.maxPrice) {
      where.price = {
        [Op.between]: [Number(filters.minPrice), Number(filters.maxPrice)]
      };
    } else if (filters.minPrice) {
      where.price = { [Op.gte]: Number(filters.minPrice) };
    } else if (filters.maxPrice) {
      where.price = { [Op.lte]: Number(filters.maxPrice) };
    }

    // Negotiable only
    if (filters.negotiableOnly === true || filters.negotiable === 'true') {
      where.priceNegotiable = true;
    }

    // Featured only
    if (filters.featured === true || filters.featured === 'true') {
      where.featured = true;
    }

    // Facing direction
    if (filters.facing) {
      where.facing = filters.facing.trim();
    }

    // Minimum bedrooms
    if (filters.bedrooms) {
      where.bedrooms = { [Op.gte]: Number(filters.bedrooms) };
    }

    // Text search query
    if (filters.q && filters.q.trim()) {
      const q = `%${filters.q.trim()}%`;
      where[Op.or] = [
        { title: { [Op.like]: q } },
        { area: { [Op.like]: q } },
        { city: { [Op.like]: q } },
        { description: { [Op.like]: q } }
      ];
    }

    // Sorting
    let order = [['createdAt', 'DESC']];
    if (filters.sort === 'price_asc' || filters.sortBy === 'price_asc') {
      order = [['price', 'ASC']];
    } else if (filters.sort === 'price_desc' || filters.sortBy === 'price_desc') {
      order = [['price', 'DESC']];
    }

    const properties = await Property.findAll({
      where,
      order,
      attributes: {
        exclude: ['updatedAt']
      }
    });

    return properties;
  },

  /**
   * Fetch every property for the admin inventory, newest first.
   */
  getAdminProperties: async (filters = {}) => {
    const requestedPage = typeof filters.page === 'string' ? Number.parseInt(filters.page, 10) : NaN;
    const requestedLimit = typeof filters.limit === 'string' ? Number.parseInt(filters.limit, 10) : NaN;
    const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
    const limit = Number.isSafeInteger(requestedLimit) && requestedLimit > 0
      ? Math.min(100, requestedLimit)
      : 10;
    const where = {};

    if (typeof filters.q === 'string' && filters.q.trim()) {
      const query = `%${filters.q.trim().slice(0, 200)}%`;
      where[Op.or] = [
        { title: { [Op.like]: query } },
        { city: { [Op.like]: query } },
        { area: { [Op.like]: query } },
        { description: { [Op.like]: query } }
      ];
    }

    const { count, rows } = await Property.findAndCountAll({
      where,
      order: [['createdAt', 'DESC'], ['id', 'DESC']],
      limit,
      offset: (page - 1) * limit
    });

    return {
      properties: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    };
  },

  /**
   * Permanently delete a property by its ID.
   */
  deleteProperty: async (id) => {
    const property = await Property.findByPk(id);
    if (!property) return false;

    await property.destroy();
    logger.info('Property deleted', { propertyId: id, slug: property.slug });

    if (typeof property.image === 'string' && property.image.startsWith('/uploads/properties/')) {
      const uploadDirectory = path.resolve(__dirname, '../..', env.UPLOAD_DIR, 'properties');
      const imagePath = path.join(uploadDirectory, path.basename(property.image));
      try {
        await fs.promises.unlink(imagePath);
      } catch (error) {
        if (error.code !== 'ENOENT') {
          logger.error('Property was deleted but its image could not be removed', error, {
            propertyId: id,
            imagePath
          });
        }
      }
    }

    return true;
  },

  /**
   * Fetch a single published property by its slug or UUID
   */
  getPropertyBySlugOrId: async (identifier) => {
    if (!identifier) return null;

    const property = await Property.findOne({
      where: {
        status: 'PUBLISHED',
        [Op.or]: [
          { slug: identifier },
          { id: identifier }
        ]
      },
      include: [
        {
          model: Admin,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return property;
  },

  /**
   * Fetch top featured properties
   */
  getFeaturedProperties: async (limit = 4) => {
    const properties = await Property.findAll({
      where: {
        status: 'PUBLISHED',
        featured: true
      },
      order: [['createdAt', 'DESC']],
      limit: Number(limit) || 4
    });

    return properties;
  },

  /**
   * Fetch aggregate property statistics for admin dashboard
   */
  getStats: async () => {
    const [total, active, houses, plots] = await Promise.all([
      Property.count(),
      Property.count({ where: { status: 'PUBLISHED' } }),
      Property.count({ where: { type: 'house', status: 'PUBLISHED' } }),
      Property.count({ where: { type: 'plot', status: 'PUBLISHED' } })
    ]);

    return {
      total,
      active,
      houses,
      plots
    };
  }
};

module.exports = propertyService;
