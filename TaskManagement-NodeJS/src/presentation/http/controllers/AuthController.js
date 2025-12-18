const ResponseMapper = require('../../mappers/ResponseMapper');
const UserMapper = require('../../mappers/UserMapper');

class AuthController {
  constructor(
    registerUseCase,
    loginUseCase,
    refreshTokenUseCase,
    logoutUseCase,
    verifyEmailUseCase,
    forgotPasswordUseCase,
    resetPasswordUseCase
  ) {
    this.registerUseCase = registerUseCase;
    this.loginUseCase = loginUseCase;
    this.refreshTokenUseCase = refreshTokenUseCase;
    this.logoutUseCase = logoutUseCase;
    this.verifyEmailUseCase = verifyEmailUseCase;
    this.forgotPasswordUseCase = forgotPasswordUseCase;
    this.resetPasswordUseCase = resetPasswordUseCase;
  }

  async register(req, res, next) {
    try {
      const result = await this.registerUseCase.execute(req.body);
      res.status(201).json(ResponseMapper.created(result, 'User registered successfully'));
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await this.loginUseCase.execute(req.body);
      res.status(200).json(ResponseMapper.success(result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const result = await this.refreshTokenUseCase.execute(req.body);
      res.status(200).json(ResponseMapper.success(result, 'Token refreshed successfully'));
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      const result = await this.logoutUseCase.execute({
        refreshToken: req.body.refreshToken,
        logoutAllDevices: req.body.logoutAllDevices || false
      });
      res.status(200).json(ResponseMapper.success(result));
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const result = await this.verifyEmailUseCase.execute({
        token: req.query.token
      });
      res.status(200).json(ResponseMapper.success(result));
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const result = await this.forgotPasswordUseCase.execute(req.body);
      res.status(200).json(ResponseMapper.success(result));
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const result = await this.resetPasswordUseCase.execute(req.body);
      res.status(200).json(ResponseMapper.success(result));
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res,next) {
try {
const user = req.user;
res.status(200).json(ResponseMapper.success(UserMapper.toDTO(user)));
} catch (error) {
next(error);
}
}
}
module.exports = AuthController;