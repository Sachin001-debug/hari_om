const ApiError = require('../utils/ApiError');

const validate = (schema) => async (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed; // sanitized and type-checked
    next();
  } catch (err) {
    if (req.file && typeof req.file.cleanup === 'function') {
      try {
        await req.file.cleanup();
      } catch {
        // Ignored
      }
    }
    if (Array.isArray(err.issues)) {
      const formattedErrors = err.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message
      }));
      return next(new ApiError(400, 'Validation failed', formattedErrors));
    }
    next(err);
  }
};

module.exports = validate;
