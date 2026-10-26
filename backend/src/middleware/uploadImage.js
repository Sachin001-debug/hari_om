'use strict';

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const UPLOAD_ROOT = path.resolve(__dirname, '../..', env.UPLOAD_DIR);
const PROPERTIES_DIR = path.join(UPLOAD_ROOT, 'properties');

fs.mkdirSync(PROPERTIES_DIR, { recursive: true });

// Allowed MIME types and extensions
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png']);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

// In-memory buffer storage: no unvalidated files touch the filesystem
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: env.MAX_FILE_SIZE_BYTES, // 5 MB
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = (file.mimetype || '').toLowerCase();

    // Strict frontend/client check
    if (!ALLOWED_EXTENSIONS.has(ext) || !ALLOWED_MIME_TYPES.has(mime)) {
      return cb(
        new ApiError(
          415,
          'Unsupported file format. Only JPEG, JPG, and PNG images are allowed.'
        ),
        false
      );
    }

    cb(null, true);
  }
});

const uploadSingleImage = upload.single('image');

const uploadImageMiddleware = (req, res, next) => {
  uploadSingleImage(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          logger.warn('File upload rejected: Size exceeds limit', {
            limitBytes: env.MAX_FILE_SIZE_BYTES,
            ip: req.ip
          });
          return next(
            new ApiError(
              413,
              `Uploaded image exceeds the maximum permitted size of ${Math.round(
                env.MAX_FILE_SIZE_BYTES / (1024 * 1024)
              )} MB.`
            )
          );
        }
        return next(new ApiError(400, `Image upload error: ${err.message}`));
      }
      return next(err);
    }

    if (!req.file) {
      return next(new ApiError(400, 'Property image is required. Please select an image.'));
    }

    // Inspect actual file content & magic bytes independently with Sharp
    let metadata;
    try {
      metadata = await sharp(req.file.buffer).metadata();
    } catch (parseError) {
      logger.warn('File rejected: Corrupt or fake image content', {
        originalName: req.file.originalname,
        error: parseError.message,
        ip: req.ip
      });
      return next(
        new ApiError(
          415,
          'Invalid image content. The uploaded file does not contain valid image data.'
        )
      );
    }

    // Validate true image format
    const format = (metadata.format || '').toLowerCase();
    if (format !== 'jpeg' && format !== 'png') {
      logger.warn(`File rejected: Disallowed format [${format}]`, {
        originalName: req.file.originalname,
        detectedFormat: format,
        ip: req.ip
      });
      return next(
        new ApiError(
          415,
          `Unsupported image format (${format.toUpperCase()}). Only JPEG, JPG, and PNG are allowed.`
        )
      );
    }

    // Validate dimensions to prevent resource exhaustion / decompression bombs
    const MAX_DIMENSION = 4096;
    const MAX_PIXELS = 16777216; // 16 Megapixels
    const width = metadata.width || 0;
    const height = metadata.height || 0;

    if (width > MAX_DIMENSION || height > MAX_DIMENSION || width * height > MAX_PIXELS) {
      logger.warn('File rejected: Image dimensions exceed maximum safe limit', {
        width,
        height,
        ip: req.ip
      });
      return next(
        new ApiError(
          400,
          `Image resolution (${width}x${height}) exceeds maximum allowed limit of ${MAX_DIMENSION}x${MAX_DIMENSION} pixels.`
        )
      );
    }

    // Generate safe random filename - Never use original filename
    const safeExtension = format === 'jpeg' ? '.jpg' : '.png';
    const safeFilename = `${crypto.randomUUID()}${safeExtension}`;
    const destinationPath = path.join(PROPERTIES_DIR, safeFilename);

    try {
      // Re-encode image to strip EXIF metadata and write sanitized file to disk
      if (format === 'jpeg') {
        await sharp(req.file.buffer)
          .jpeg({ quality: 85, mozjpeg: true })
          .toFile(destinationPath);
      } else {
        await sharp(req.file.buffer)
          .png({ compressionLevel: 8 })
          .toFile(destinationPath);
      }

      req.file.filename = safeFilename;
      req.file.path = destinationPath;
      req.file.storedUrl = `/uploads/properties/${safeFilename}`;

      // Cleanup hook if subsequent request handling fails
      req.file.cleanup = async () => {
        try {
          if (fs.existsSync(destinationPath)) {
            await fs.promises.unlink(destinationPath);
            logger.info('Cleaned up temporary uploaded image', { path: destinationPath });
          }
        } catch (cleanupErr) {
          logger.error('Failed to clean up uploaded file', cleanupErr, { path: destinationPath });
        }
      };

      next();
    } catch (saveError) {
      logger.error('Failed to save sanitized image to storage', saveError);
      return next(new ApiError(500, 'Failed to process and store property image.'));
    }
  });
};

module.exports = uploadImageMiddleware;
