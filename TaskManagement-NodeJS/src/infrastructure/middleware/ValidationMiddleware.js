const { ValidationError } = require('../../shared/errors');

class ValidationMiddleware {
  static validate(schema, property = 'body') {
    return (req, res, next) => {
      const { error, value } = schema.validate(req[property], {
        abortEarly: false, // Trả về tất cả errors
        stripUnknown: true // Bỏ các fields không có trong schema
      });

      if (error) {
        const errorDetails = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message.replace(/"/g, '')
        }));

        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Validation failed',
            details: errorDetails
          }
        });
      }

      // Replace request data với validated data
      req[property] = value;
      next();
    };
  }
}

module.exports = ValidationMiddleware;