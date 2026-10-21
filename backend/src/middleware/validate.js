const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse(req.body);
    req.body = parsed; // sanitized and type-checked
    next();
  } catch (err) {
    if (err.errors) {
      const formattedErrors = err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message
      }));
      return next(new ApiError(400, 'Validation failed', formattedErrors));
    }
    next(err);
  }
};

module.exports = validate;

