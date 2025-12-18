const express = require('express');
const ValidationMiddleware = require('../../../infrastructure/middleware/ValidationMiddleware');
const AuthValidator = require('../../validators/AuthValidator');

function createAuthRouter(authController, authMiddleware) {
  const router = express.Router();

  router.post(
    '/register',
    ValidationMiddleware.validate(AuthValidator.register),
    authController.register.bind(authController)
  );

  router.post(
    '/login',
    ValidationMiddleware.validate(AuthValidator.login),
    authController.login.bind(authController)
  );

  router.post(
    '/refresh-token',
    ValidationMiddleware.validate(AuthValidator.refreshToken),
    authController.refreshToken.bind(authController)
  );

  router.post(
    '/logout',
    ValidationMiddleware.validate(AuthValidator.logout),
    authController.logout.bind(authController)
  );

  router.get(
    '/verify-email',
    ValidationMiddleware.validate(AuthValidator.verifyEmail, 'query'),
    authController.verifyEmail.bind(authController)
  );

  router.post(
    '/forgot-password',
    ValidationMiddleware.validate(AuthValidator.forgotPassword),
    authController.forgotPassword.bind(authController)
  );

  router.post(
    '/reset-password',
    ValidationMiddleware.validate(AuthValidator.resetPassword),
    authController.resetPassword.bind(authController)
  );

  // Protected routes
  router.get(
    '/profile',
    authMiddleware.authenticate(),
    authController.getProfile.bind(authController)
  );

  return router;
}

module.exports = createAuthRouter;