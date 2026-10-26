'use strict';

const crypto = require('crypto');
const path = require('path');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let demoListings = [];
    try {
      const listingsPath = path.resolve(__dirname, '../../../../frontend/src/data/listings.js');
      const mod = require(listingsPath);
      demoListings = mod.listings || [];
    } catch {
      demoListings = [];
    }

    if (!demoListings.length) {
      console.log('[Seeder] No demo listings found to seed.');
      return;
    }

    // Get an admin ID if available
    let adminId = null;
    try {
      const [admins] = await queryInterface.sequelize.query(
        'SELECT id FROM admins ORDER BY createdAt ASC LIMIT 1',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      if (admins) {
        adminId = admins.id;
      }
    } catch {
      adminId = null;
    }

    for (const item of demoListings) {
      const [existing] = await queryInterface.sequelize.query(
        'SELECT id FROM properties WHERE slug = :slug LIMIT 1',
        {
          replacements: { slug: item.slug },
          type: queryInterface.sequelize.QueryTypes.SELECT
        }
      );

      if (!existing) {
        const id = crypto.randomUUID();
        const now = item.createdAt ? new Date(item.createdAt) : new Date();
        await queryInterface.bulkInsert('properties', [
          {
            id,
            slug: item.slug,
            title: item.title,
            type: item.type,
            price: item.price,
            priceNegotiable: Boolean(item.priceNegotiable),
            city: item.city,
            area: item.area,
            keywords: JSON.stringify(item.keywords || []),
            description: item.description,
            landAreaValue: item.landArea?.value || 10,
            landAreaUnit: item.landArea?.unit || 'Dhur',
            bedrooms: item.bedrooms || null,
            bathrooms: item.bathrooms || null,
            roadWidth: item.roadWidth || '20 ft pitched',
            facing: item.facing || 'East',
            legalStatus: 'Freehold (Lalpurja verified)',
            waterSupply: 'Deep boring & municipal line',
            electricity: 'NEA 3-phase connection',
            parking: item.type === 'house' ? 'Covered garage (2 cars)' : null,
            construction: item.type === 'house' ? 'Earthquake-resistant RCC frame' : null,
            image: item.image,
            images: JSON.stringify([]),
            featured: Boolean(item.featured),
            status: 'PUBLISHED',
            createdBy: adminId,
            createdAt: now,
            updatedAt: now
          }
        ]);
      }
    }

    console.log(`[Seeder] Processed ${demoListings.length} demo properties.`);
  },

  down: async (queryInterface, Sequelize) => {
    // Optionally clean up seeded properties
    try {
      const listingsPath = path.resolve(__dirname, '../../../../frontend/src/data/listings.js');
      const mod = require(listingsPath);
      const slugs = (mod.listings || []).map((l) => l.slug);
      if (slugs.length) {
        await queryInterface.bulkDelete('properties', {
          slug: { [Sequelize.Op.in]: slugs }
        });
      }
    } catch {
      // Ignored
    }
  }
};

