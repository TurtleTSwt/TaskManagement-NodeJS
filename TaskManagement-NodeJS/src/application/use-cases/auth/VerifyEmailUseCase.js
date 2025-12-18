const { UserNotFoundError, InvalidTokenError } = require('../../../shared/errors');

class VerifyEmailUseCase {
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  async execute(input) {
    // 1. Verify token
    let payload;
    try {
      payload = await this.tokenService.verifyEmailToken(input.token);
    } catch (error) {
      throw new InvalidTokenError();
    }

    // 2. Tìm user
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    // 3. Check đã verify chưa
    if (user.isEmailVerified()) {
      return {
        success: true,
        message: 'Email already verified'
      };
    }

    // 4. Verify email
    user.verifyEmail();

    // 5. Update user
    await this.userRepository.update(user);

    return {
      success: true,
      message: 'Email verified successfully'
    };
  }
}

module.exports = VerifyEmailUseCase;