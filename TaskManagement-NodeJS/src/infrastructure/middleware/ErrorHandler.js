const { DomainError } = require('../../shared/errors');
const ErrorMapper = require('../../presentation/mappers/ErrorMapper');

class ErrorHandler {
  static handle(err, req, res, next) {
    console.error('Error:', err);

    // Xử lý Domain Errors
    if (err instanceof DomainError) {
      return res.status(err.statusCode).json({
        success: false,
        error: {
          code: err.name,
          message: err.message
        }
      });
    }

    // Xử lý Validation Errors (Joi)
    if (err.isJoi) {
      return res.status(400).json(ErrorMapper.toResponse(err));
    }

    // Xử lý MySQL Errors
    if (err.code && err.code.startsWith('ER_')) {
      return res.status(500).json(ErrorMapper.toResponse(err));
    }

    // JWT Errors
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired token'
        }
      });
    }

    // Default Error
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'production' 
          ? 'An unexpected error occurred' 
          : err.message
      }
    });
  }
}

module.exports = ErrorHandler;