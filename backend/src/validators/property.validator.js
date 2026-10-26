'use strict';

const { z } = require('zod');

const allowedLandUnits = ['Dhur', 'Katha', 'Bigha', 'Ropani', 'Aana', 'Sq. ft.'];

const createPropertySchema = z
  .object({
    title: z
      .string({ error: 'Property title is required' })
      .trim()
      .min(3, 'Property title must be at least 3 characters')
      .max(120, 'Property title cannot exceed 120 characters'),

    type: z.enum(['house', 'plot'], {
      error: 'Property type must be either "house" or "plot"'
    }),

    price: z.coerce
      .number({ error: 'Asking price is required' })
      .positive('Asking price must be a positive number')
      .max(10000000000, 'Price exceeds maximum allowed value of 10 Billion NPR'),

    priceNegotiable: z
      .preprocess((val) => {
        if (typeof val === 'string') return val.toLowerCase() === 'true' || val === '1';
        return Boolean(val);
      }, z.boolean())
      .default(false),

    city: z
      .string({ error: 'City is required' })
      .trim()
      .min(2, 'City name must be at least 2 characters')
      .max(100, 'City name cannot exceed 100 characters'),

    area: z
      .string({ error: 'Area / neighbourhood is required' })
      .trim()
      .min(2, 'Area name must be at least 2 characters')
      .max(100, 'Area name cannot exceed 100 characters'),

    keywords: z
      .preprocess((val) => {
        if (typeof val === 'string') {
          return val
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean);
        }
        if (Array.isArray(val)) {
          return val.map((k) => String(k).trim()).filter(Boolean);
        }
        return [];
      }, z.array(z.string().max(50)).max(20))
      .default([]),

    description: z
      .string({ error: 'Property description is required' })
      .trim()
      .min(10, 'Description must be at least 10 characters long')
      .max(2000, 'Description cannot exceed 2000 characters'),

    landAreaValue: z.coerce
      .number({ error: 'Land area value is required' })
      .positive('Land area must be a positive number'),

    landAreaUnit: z
      .string()
      .refine((val) => allowedLandUnits.includes(val), {
        message: `Land area unit must be one of: ${allowedLandUnits.join(', ')}`
      })
      .default('Dhur'),

    bedrooms: z
      .preprocess((val) => {
        if (val === '' || val === null || val === undefined) return null;
        const n = Number(val);
        return isNaN(n) ? val : n;
      }, z.number().int('Bedrooms must be a whole number').min(0, 'Bedrooms cannot be negative').max(50).nullable().optional())
      .default(null),

    bathrooms: z
      .preprocess((val) => {
        if (val === '' || val === null || val === undefined) return null;
        const n = Number(val);
        return isNaN(n) ? val : n;
      }, z.number().int('Bathrooms must be a whole number').min(0, 'Bathrooms cannot be negative').max(50).nullable().optional())
      .default(null),

    roadWidth: z
      .string()
      .trim()
      .max(100, 'Road access string cannot exceed 100 characters')
      .nullable()
      .optional()
      .default(''),

    facing: z
      .string()
      .trim()
      .max(50, 'Facing direction cannot exceed 50 characters')
      .nullable()
      .optional()
      .default(''),

    legalStatus: z
      .string()
      .trim()
      .max(255, 'Legal status cannot exceed 255 characters')
      .optional()
      .default('Freehold (Lalpurja verified)'),

    waterSupply: z
      .string()
      .trim()
      .max(255, 'Water supply cannot exceed 255 characters')
      .optional()
      .default('Deep boring & municipal line'),

    electricity: z
      .string()
      .trim()
      .max(255, 'Electricity cannot exceed 255 characters')
      .optional()
      .default('NEA 3-phase connection'),

    parking: z
      .string()
      .trim()
      .max(255, 'Parking description cannot exceed 255 characters')
      .nullable()
      .optional()
      .default(''),

    construction: z
      .string()
      .trim()
      .max(255, 'Construction description cannot exceed 255 characters')
      .nullable()
      .optional()
      .default(''),

    featured: z
      .preprocess((val) => {
        if (typeof val === 'string') return val.toLowerCase() === 'true' || val === '1';
        return Boolean(val);
      }, z.boolean())
      .default(false),

    status: z.enum(['PUBLISHED', 'DRAFT', 'ARCHIVED']).default('PUBLISHED'),

    createdAt: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Listing date must be in YYYY-MM-DD format')
      .optional()
  })
  .refine(
    (data) => {
      if (data.type === 'house') {
        return data.bedrooms !== null && data.bedrooms >= 1;
      }
      return true;
    },
    {
      message: 'Bedrooms is required for houses and must be at least 1',
      path: ['bedrooms']
    }
  )
  .refine(
    (data) => {
      if (data.type === 'house') {
        return data.bathrooms !== null && data.bathrooms >= 1;
      }
      return true;
    },
    {
      message: 'Bathrooms is required for houses and must be at least 1',
      path: ['bathrooms']
    }
  );

module.exports = {
  createPropertySchema
};
