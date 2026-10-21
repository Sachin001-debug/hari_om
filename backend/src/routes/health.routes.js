const express = require('express');
const { sequelize } = require('../database');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    let dbStatus = 'healthy';
    try {
      await sequelize.authenticate();
    } catch {
      dbStatus = 'degraded';
    }

    res.status(dbStatus === 'healthy' ? 200 : 503).json({
      status: dbStatus === 'healthy' ? 'ok' : 'degraded',
      service: 'Hari Om Real Estate Authentication API',
      database: dbStatus,
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime())
    });
  })
);

module.exports = router;
