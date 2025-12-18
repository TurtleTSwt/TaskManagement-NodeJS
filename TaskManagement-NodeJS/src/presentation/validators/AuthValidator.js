const Joi = require('joi');

class AuthValidator {
  static register = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[A-Z])(?=.*[0-9])/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter and one number',
        'any.required': 'Password is required'
      }),
    fullName: Joi.string()
      .min(2)
      .max(255)
      .required()
      .messages({
        'string.min': 'Full name must be at least 2 characters long',
        'string.max': 'Full name must not exceed 255 characters',
        'any.required': 'Full name is required'
      })
  });

  static login = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'Password is required'
      })
  });

  static refreshToken = Joi.object({
    refreshToken: Joi.string()
      .required()
      .messages({
        'any.required': 'Refresh token is required'
      })
  });

  static logout = Joi.object({
    refreshToken: Joi.string()
      .required()
      .messages({
        'any.required': 'Refresh token is required'
      }),
    logoutAllDevices: Joi.boolean()
      .default(false)
  });

  static verifyEmail = Joi.object({
    token: Joi.string()
      .required()
      .messages({
        'any.required': 'Verification token is required'
      })
  });

  static forgotPassword = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      })
  });

  static resetPassword = Joi.object({
    token: Joi.string()
      .required()
      .messages({
        'any.required': 'Reset token is required'
      }),
    newPassword: Joi.string()
      .min(8)
      .pattern(/^(?=.*[A-Z])(?=.*[0-9])/)
      .required()
      .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.pattern.base': 'Password must contain at least one uppercase letter and one number',
        'any.required': 'New password is required'
      })
  });
}

module.exports = AuthValidator;