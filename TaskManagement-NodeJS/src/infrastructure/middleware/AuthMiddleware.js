const { UnauthorizedError } = require('../../shared/errors');

class AuthMiddleware {
  constructor(tokenService, userRepository) {
    this.tokenService = tokenService;
    this.userRepository = userRepository;
  }

  authenticate() {
    return async (req, res, next) => {
      try {
        // 1. Lấy token từ header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          throw new UnauthorizedError();
        }

        const token = authHeader.substring(7); // Bỏ "Bearer "

        // 2. Verify token
        const payload = await this.tokenService.verifyAccessToken(token);

        // 3. Kiểm tra user còn tồn tại không
        const user = await this.userRepository.findById(payload.userId);
        if (!user) {
          throw new UnauthorizedError();
        }

        // 4. Kiểm tra user active
        if (!user.isActive()) {
          throw new UnauthorizedError();
        }

        // 5. Gắn userId vào request
        req.userId = payload.userId;
        req.user = user;

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Middleware kiểm tra email đã verify
  requireEmailVerified() {
    return async (req, res, next) => {
      try {
        if (!req.user) {
          throw new UnauthorizedError();
        }

        if (!req.user.isEmailVerified()) {
          return res.status(403).json({
            success: false,
            error: {
              code: 'EMAIL_NOT_VERIFIED',
              message: 'Please verify your email address first'
            }
          });
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  // Middleware optional authentication (không bắt buộc đăng nhập)
  optionalAuth() {
    return async (req, res, next) => {
      try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return next(); // Không có token, tiếp tục nhưng không có userId
        }

        const token = authHeader.substring(7);
        const payload = await this.tokenService.verifyAccessToken(token);
        
        const user = await this.userRepository.findById(payload.userId);
        if (user && user.isActive()) {
          req.userId = payload.userId;
          req.user = user;
        }

        next();
      } catch (error) {
        // Token invalid nhưng không throw error, chỉ bỏ qua
        next();
      }
    };
  }
}

module.exports = AuthMiddleware;