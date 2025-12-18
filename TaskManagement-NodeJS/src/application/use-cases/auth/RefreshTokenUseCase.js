const { InvalidTokenError, UserNotFoundError } = require('../../../shared/errors');

class RefreshTokenUseCase {
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  async execute(input) {
    // 1. Verify refresh token
    const payload = await this.tokenService.verifyRefreshToken(input.refreshToken);

    // 2. Tìm user
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    // 3. Check user active
    if (!user.isActive()) {
      throw new InvalidTokenError();
    }

    // 4. Generate new tokens
    const accessToken = await this.tokenService.generateAccessToken(user.id);
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken
    };
  }
}

module.exports = RefreshTokenUseCase;