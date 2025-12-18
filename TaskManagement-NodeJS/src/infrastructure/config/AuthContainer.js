const MySQLUserRepository = require('../repositories/MySQLUserRepository');
const MySQLRefreshTokenRepository = require('../repositories/MySQLRefreshTokenRepository');
const MySQLPasswordResetRepository = require('../repositories/MySQLPasswordResetRepository');

const BcryptPasswordHasher = require('../services/BcryptPasswordHasher');
const JwtTokenService = require('../services/JwtTokenService');
const NodemailerEmailService = require('../services/NodemailerEmailService');

const RegisterUseCase = require('../../application/use-cases/auth/RegisterUseCase');
const LoginUseCase = require('../../application/use-cases/auth/LoginUseCase');
const RefreshTokenUseCase = require('../../application/use-cases/auth/RefreshTokenUseCase');
const LogoutUseCase = require('../../application/use-cases/auth/LogoutUseCase');
const VerifyEmailUseCase = require('../../application/use-cases/auth/VerifyEmailUseCase');
const ForgotPasswordUseCase = require('../../application/use-cases/auth/ForgotPasswordUseCase');
const ResetPasswordUseCase = require('../../application/use-cases/auth/ResetPasswordUseCase');

const AuthController = require('../../presentation/http/controllers/AuthController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

const createAuthRouter = require('../../presentation/http/routes/auth.routes');

class AuthContainer {
  constructor(dbConnection) {
    this.db = dbConnection;
    this.initializeDependencies();
  }

  initializeDependencies() {
    this.userRepository = new MySQLUserRepository(this.db);
    this.refreshTokenRepository = new MySQLRefreshTokenRepository(this.db);
    this.passwordResetRepository = new MySQLPasswordResetRepository(this.db);

    this.passwordHasher = new BcryptPasswordHasher();
    this.tokenService = new JwtTokenService();
    this.emailService = new NodemailerEmailService();

    this.registerUseCase = new RegisterUseCase(
      this.userRepository,
      this.passwordHasher,
      this.emailService
    );

    this.loginUseCase = new LoginUseCase(
      this.userRepository,
      this.passwordHasher,
      this.tokenService
    );

    this.refreshTokenUseCase = new RefreshTokenUseCase(
      this.userRepository,
      this.tokenService
    );

    this.logoutUseCase = new LogoutUseCase(
      this.refreshTokenRepository,
      this.tokenService
    );

    this.verifyEmailUseCase = new VerifyEmailUseCase(
      this.userRepository,
      this.tokenService
    );

    this.forgotPasswordUseCase = new ForgotPasswordUseCase(
      this.userRepository,
      this.tokenService,
      this.emailService,
      this.passwordResetRepository
    );

    this.resetPasswordUseCase = new ResetPasswordUseCase(
      this.userRepository,
      this.passwordHasher,
      this.passwordResetRepository
    );

    this.authController = new AuthController(
      this.registerUseCase,
      this.loginUseCase,
      this.refreshTokenUseCase,
      this.logoutUseCase,
      this.verifyEmailUseCase,
      this.forgotPasswordUseCase,
      this.resetPasswordUseCase
    );

    this.authMiddleware = new AuthMiddleware(
      this.tokenService,
      this.userRepository
    );
  }

  getAuthRouter() {
    return createAuthRouter(this.authController, this.authMiddleware);
  }

  getAuthMiddleware() {
    return this.authMiddleware;
  }

  getUserRepository() {
    return this.userRepository;
  }

  getEmailService() {
    return this.emailService;
  }
}

module.exports = AuthContainer;