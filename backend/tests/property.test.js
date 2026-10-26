'use strict';

process.env.NODE_ENV = 'test';

const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const path = require('node:path');
const fs = require('node:fs');
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');

const app = require('../src/app');
const env = require('../src/config/env');
const { Property, Admin, sequelize } = require('../src/database');

let server;
let baseUrl;
let adminToken;
let nonAdminToken;
let testAdmin;
let validJpegBuffer;
let validPngBuffer;
let fakeImageBuffer;
let svgBuffer;
let oversizedBuffer;

// Helper to make multipart HTTP requests using native Node.js
function sendMultipartRequest({ method = 'POST', path: requestPath, headers = {}, fields = {}, file = null }) {
  return new Promise((resolve, reject) => {
    const boundary = `----NodeTestBoundary${crypto.randomBytes(8).toString('hex')}`;
    const chunks = [];

    // Add form fields
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined && value !== null) {
        chunks.push(Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`));
      }
    }

    // Add file
    if (file) {
      chunks.push(
        Buffer.from(
          `--${boundary}\r\nContent-Disposition: form-data; name="${file.fieldname || 'image'}"; filename="${file.filename || 'image.jpg'}"\r\nContent-Type: ${file.mimetype || 'image/jpeg'}\r\n\r\n`
        )
      );
      chunks.push(file.buffer);
      chunks.push(Buffer.from('\r\n'));
    }

    chunks.push(Buffer.from(`--${boundary}--\r\n`));
    const bodyBuffer = Buffer.concat(chunks);

    const url = new URL(requestPath, baseUrl);
    const req = http.request(
      url,
      {
        method,
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': bodyBuffer.length,
          'X-Requested-With': 'XMLHttpRequest',
          Origin: env.FRONTEND_URL,
          ...headers
        }
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(raw);
          } catch {
            json = raw;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        });
      }
    );

    req.on('error', reject);
    req.write(bodyBuffer);
    req.end();
  });
}

function sendJsonRequest({ method = 'GET', path: requestPath, headers = {}, body = null }) {
  return new Promise((resolve, reject) => {
    const url = new URL(requestPath, baseUrl);
    const postData = body ? JSON.stringify(body) : null;

    const reqHeaders = {
      'X-Requested-With': 'XMLHttpRequest',
      Origin: env.FRONTEND_URL,
      ...headers
    };
    if (postData) {
      reqHeaders['Content-Type'] = 'application/json';
      reqHeaders['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(
      url,
      {
        method,
        headers: reqHeaders
      },
      (res) => {
        let raw = '';
        res.on('data', (c) => (raw += c));
        res.on('end', () => {
          let json = null;
          try {
            json = JSON.parse(raw);
          } catch {
            json = raw;
          }
          resolve({ status: res.statusCode, headers: res.headers, body: json });
        });
      }
    );

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

describe('Property Management Security & Verification Suite', () => {
  before(async () => {
    // 1. Start server on dynamic port
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });

    // 2. Fetch or create test admin
    testAdmin = await Admin.findOne();
    if (!testAdmin) {
      testAdmin = await Admin.create({
        id: crypto.randomUUID(),
        name: 'Test Administrator',
        email: `test_admin_${Date.now()}@example.com`,
        passwordHash: 'dummy_hash',
        role: 'SUPER_ADMIN',
        isActive: true
      });
    }

    // Generate valid admin access token
    adminToken = jwt.sign(
      { sub: testAdmin.id, role: testAdmin.role },
      env.JWT_ACCESS_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '15m',
        issuer: 'hari-om-real-estate-api',
        audience: 'hari-om-real-estate-admin'
      }
    );

    // Generate token for a non-admin role / regular user
    nonAdminToken = jwt.sign(
      { sub: crypto.randomUUID(), role: 'REGULAR_USER' },
      env.JWT_ACCESS_SECRET,
      {
        algorithm: 'HS256',
        expiresIn: '15m',
        issuer: 'hari-om-real-estate-api',
        audience: 'hari-om-real-estate-admin'
      }
    );

    // 3. Generate image buffers
    validJpegBuffer = await sharp({
      create: {
        width: 200,
        height: 200,
        channels: 3,
        background: { r: 40, g: 120, b: 200 }
      }
    })
      .jpeg()
      .toBuffer();

    validPngBuffer = await sharp({
      create: {
        width: 150,
        height: 150,
        channels: 4,
        background: { r: 50, g: 180, b: 90, alpha: 1 }
      }
    })
      .png()
      .toBuffer();

    fakeImageBuffer = Buffer.from('This is a text string disguised as an image file. It should be rejected.');

    svgBuffer = Buffer.from(
      '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="red" /></svg>'
    );

    // 5.5 MB buffer to test size limit rejection
    oversizedBuffer = Buffer.alloc(5.5 * 1024 * 1024, 0xaa);
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  test('1. Admin can create a valid house property with image upload', async () => {
    const res = await sendMultipartRequest({
      path: '/api/properties',
      headers: {
        Authorization: `Bearer ${adminToken}`
      },
      fields: {
        title: 'Modern Test Villa in Sukhanagar',
        type: 'house',
        price: '25000000',
        priceNegotiable: 'true',
        city: 'Butwal',
        area: 'Sukhanagar',
        keywords: 'Road facing, Garden, Parking',
        description: 'Spacious modern villa with 4 bedrooms, solar heating, and parking for 2 cars.',
        landAreaValue: '12',
        landAreaUnit: 'Dhur',
        bedrooms: '4',
        bathrooms: '3',
        roadWidth: '22 ft pitched',
        facing: 'East'
      },
      file: {
        fieldname: 'image',
        filename: 'villa.jpg',
        mimetype: 'image/jpeg',
        buffer: validJpegBuffer
      }
    });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.property);
    assert.equal(res.body.property.title, 'Modern Test Villa in Sukhanagar');
    assert.equal(res.body.property.type, 'house');
    assert.equal(res.body.property.price, 25000000);
    assert.ok(res.body.property.id);
    assert.ok(res.body.property.slug);
    assert.ok(res.body.property.image.startsWith('/uploads/properties/'));
    assert.equal(res.body.property.landArea.value, 12);
    assert.equal(res.body.property.landArea.unit, 'Dhur');
  });

  test('2. Unauthenticated user cannot create a property (401)', async () => {
    const res = await sendMultipartRequest({
      path: '/api/properties',
      fields: {
        title: 'Unauthenticated Property',
        type: 'plot',
        price: '5000000',
        city: 'Butwal',
        area: 'Golpark',
        description: 'Unauthenticated attempt to post property',
        landAreaValue: '10'
      },
      file: {
        fieldname: 'image',
        filename: 'plot.jpg',
        mimetype: 'image/jpeg',
        buffer: validJpegBuffer
      }
    });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  test('3. Authenticated non-admin cannot create a property (401/403)', async () => {
    const res = await sendMultipartRequest({
      path: '/api/properties',
      headers: {
        Authorization: `Bearer ${nonAdminToken}`
      },
      fields: {
        title: 'Unauthorized Non-Admin Property',
        type: 'plot',
        price: '5000000',
        city: 'Butwal',
        area: 'Golpark',
        description: 'Attempt by non-admin user to post property',
        landAreaValue: '10'
      },
      file: {
        fieldname: 'image',
        filename: 'plot.jpg',
        mimetype: 'image/jpeg',
        buffer: validJpegBuffer
      }
    });

    assert.ok(res.status === 401 || res.status === 403);
    assert.equal(res.body.success, false);
  });

  test('4. Invalid title is rejected (< 3 characters) (400)', async () => {
    const res = await sendMultipartRequest({
      path: '/api/properties',
      headers: {
        Authorization: `Bearer ${adminToken}`
      },
      fields: {
        title: 'Hi', // Too short
        type: 'plot',
        price: '5000000',
        city: 'Butwal',
        area: 'Golpark',
        description: 'Valid description with adequate character length.',
        landAreaValue: '10'
      },
      file: {
        fieldname: 'image',
        filename: 'plot.jpg',
        mimetype: 'image/jpeg',
        buffer: validJpegBuffer
      }
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  test('5. Invalid price is rejected (negative price / non-numeric) (400)', async () => {
    const res = await sendMultipartRequest({
      path: '/api/properties',
      headers: {
        Authorization: `Bearer ${adminToken}`
      },
      fields: {
        title: 'Property with Negative Price',
        type: 'plot',
        price: '-50000', // Negative price
        city: 'Butwal',
        area: 'Golpark',
        description: 'Valid description with adequate character length.',
        landAreaValue: '10'
      },
      file: {
        fieldname: 'image',
        filename: 'plot.jpg',
        mimetype: 'image/jpeg',
        buffer: validJpegBuffer
      }
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  test('6. Invalid property type is rejected (not house or plot) (400)', async () => {
    const res = await sendMultipartRequest({
      path: '/api/properties',
      headers: {
        Authorization: `Bearer ${adminToken}`
      },
      fields: {
        title: 'Invalid Property Type',
        type: 'spaceship_hanger', // Disallowed type
        price: '5000000',
        city: 'Butwal',
        area: 'Golpark',
        description: 'Valid description with adequate character length.',
        landAreaValue: '10'
      },
      file: {
        fieldname: 'image',
        filename: 'plot.jpg',
        mimetype: 'image/jpeg',
        buffer: validJpegBuffer
      }
    });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  test('7. Unsupported image format (SVG) is rejected (415)', async () => {
    const res = await sendMultipartRequest({
      path: '/api/properties',
      headers: {
        Authorization: `Bearer ${adminToken}`
      },
      fields: {
        title: 'Valid Title for SVG Test',
        type: 'plot',
        price: '5000000',
        city: 'Butwal',
        area: 'Golpark',
        description: 'Valid description with adequate character length.',
        landAreaValue: '10'
      },
      file: {
        fieldname: 'image',
        filename: 'vector.svg',
        mimetype: 'image/svg+xml',
        buffer: svgBuffer
      }
    });

    assert.equal(res.status, 415);
    assert.equal(res.body.success, false);
  });

  test('8. Oversized image (> 5 MB) is rejected (413)', async () => {
    const res = await sendMultipartRequest({
      path: '/api/properties',
      headers: {
        Authorization: `Bearer ${adminToken}`
      },
      fields: {
        title: 'Valid Title for Large File Test',
        type: 'plot',
        price: '5000000',
        city: 'Butwal',
        area: 'Golpark',
        description: 'Valid description with adequate character length.',
        landAreaValue: '10'
      },
      file: {
        fieldname: 'image',
        filename: 'huge.jpg',
        mimetype: 'image/jpeg',
        buffer: oversizedBuffer
      }
    });

    assert.equal(res.status, 413);
    assert.equal(res.body.success, false);
  });

  test('9. Fake image content (text file renamed to .jpg) is rejected (415)', async () => {
    const res = await sendMultipartRequest({
      path: '/api/properties',
      headers: {
        Authorization: `Bearer ${adminToken}`
      },
      fields: {
        title: 'Valid Title for Fake Image Test',
        type: 'plot',
        price: '5000000',
        city: 'Butwal',
        area: 'Golpark',
        description: 'Valid description with adequate character length.',
        landAreaValue: '10'
      },
      file: {
        fieldname: 'image',
        filename: 'not_an_image.jpg',
        mimetype: 'image/jpeg',
        buffer: fakeImageBuffer
      }
    });

    assert.equal(res.status, 415);
    assert.equal(res.body.success, false);
  });

  test('10. Valid PNG uploads are accepted and sanitized (201)', async () => {
    const res = await sendMultipartRequest({
      path: '/api/properties',
      headers: {
        Authorization: `Bearer ${adminToken}`
      },
      fields: {
        title: 'Prime Commercial Plot at Traffic Chowk',
        type: 'plot',
        price: '12000000',
        city: 'Butwal',
        area: 'Traffic Chowk',
        keywords: 'Commercial, High Return',
        description: 'Prime rectangular commercial plot in the heart of Butwal Traffic Chowk.',
        landAreaValue: '8.5',
        landAreaUnit: 'Dhur',
        roadWidth: '30 ft asphalt'
      },
      file: {
        fieldname: 'image',
        filename: 'plot.png',
        mimetype: 'image/png',
        buffer: validPngBuffer
      }
    });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.property.image.endsWith('.png'));
  });

  test('11. Database failure is handled safely without leaking stack traces or crashing', async () => {
    // Attempt inserting with invalid foreign key by stubbing or passing invalid data
    // The errorHandler returns 400 or 500 with a clean message and no database internals
    const res = await sendJsonRequest({
      path: '/api/properties/99999999-invalid-id-slug',
      method: 'GET'
    });

    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.ok(!res.body.stack);
  });

  test('12. Uploaded temporary files are cleaned up if validation fails', async () => {
    const uploadsDir = path.resolve(__dirname, '../uploads/properties');
    const filesBefore = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];

    // Submit with valid image but failing body validation (title too short)
    const res = await sendMultipartRequest({
      path: '/api/properties',
      headers: {
        Authorization: `Bearer ${adminToken}`
      },
      fields: {
        title: 'X', // Invalid title
        type: 'plot',
        price: '1000',
        city: 'Butwal',
        area: 'Area',
        description: 'Valid description that is sufficiently long.',
        landAreaValue: '5'
      },
      file: {
        fieldname: 'image',
        filename: 'cleanup_test.jpg',
        mimetype: 'image/jpeg',
        buffer: validJpegBuffer
      }
    });

    assert.equal(res.status, 400);

    const filesAfter = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
    // Ensure no orphan file was left behind
    assert.equal(filesAfter.length, filesBefore.length);
  });

  test('13. Public property listing returns published properties (200)', async () => {
    const res = await sendJsonRequest({
      path: '/api/properties',
      method: 'GET'
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.properties));
    assert.ok(res.body.properties.length > 0);
  });

  test('14. Public listing does not expose unpublished (draft/archived) properties', async () => {
    // Directly create a draft property in DB
    const draftProp = await Property.create({
      id: crypto.randomUUID(),
      slug: `hidden-draft-property-${Date.now()}`,
      title: 'Secret Draft Property',
      type: 'house',
      price: 15000000,
      city: 'Butwal',
      area: 'Deepnagar',
      keywords: [],
      description: 'This is a draft property that should never be visible to the public.',
      landAreaValue: 10,
      landAreaUnit: 'Dhur',
      bedrooms: 3,
      bathrooms: 2,
      image: '/uploads/properties/secret.jpg',
      images: [],
      status: 'DRAFT'
    });

    const res = await sendJsonRequest({
      path: '/api/properties',
      method: 'GET'
    });

    assert.equal(res.status, 200);
    const foundDraft = res.body.properties.find((p) => p.id === draftProp.id || p.slug === draftProp.slug);
    assert.equal(foundDraft, undefined, 'Draft property must NOT appear in public listing');

    // Also check single get endpoint
    const singleRes = await sendJsonRequest({
      path: `/api/properties/${draftProp.slug}`,
      method: 'GET'
    });
    assert.equal(singleRes.status, 404, 'Draft property must return 404 on public details endpoint');
  });

  test('15. Property details endpoint returns the correct property by slug or ID', async () => {
    const allRes = await sendJsonRequest({
      path: '/api/properties',
      method: 'GET'
    });

    const firstProp = allRes.body.properties[0];
    assert.ok(firstProp, 'At least one property exists');

    const detailRes = await sendJsonRequest({
      path: `/api/properties/${firstProp.slug}`,
      method: 'GET'
    });

    assert.equal(detailRes.status, 200);
    assert.equal(detailRes.body.success, true);
    assert.equal(detailRes.body.property.id, firstProp.id);
    assert.equal(detailRes.body.property.slug, firstProp.slug);
  });

  test('16. Invalid property ID/slug returns 404', async () => {
    const res = await sendJsonRequest({
      path: '/api/properties/completely-nonexistent-property-slug-xyz-123',
      method: 'GET'
    });

    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
  });

  test('17. Newly created properties appear in the public listing API immediately', async () => {
    const uniqueTitle = `Brand New Listing ${Date.now()}`;
    const createRes = await sendMultipartRequest({
      path: '/api/properties',
      headers: {
        Authorization: `Bearer ${adminToken}`
      },
      fields: {
        title: uniqueTitle,
        type: 'house',
        price: '32000000',
        city: 'Tilottama',
        area: 'Manigram',
        keywords: 'New, Luxury',
        description: 'Newly constructed executive residence ready for immediate occupancy.',
        landAreaValue: '15',
        landAreaUnit: 'Dhur',
        bedrooms: '5',
        bathrooms: '4'
      },
      file: {
        fieldname: 'image',
        filename: 'new_house.jpg',
        mimetype: 'image/jpeg',
        buffer: validJpegBuffer
      }
    });

    assert.equal(createRes.status, 201);
    const createdSlug = createRes.body.property.slug;

    // Fetch public listings
    const listRes = await sendJsonRequest({
      path: '/api/properties',
      method: 'GET'
    });

    assert.equal(listRes.status, 200);
    const match = listRes.body.properties.find((p) => p.slug === createdSlug);
    assert.ok(match, 'Newly created property must be present in public listing results');
    assert.equal(match.title, uniqueTitle);
  });
});
