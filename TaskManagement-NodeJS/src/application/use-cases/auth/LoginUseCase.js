const { 
  InvalidCredentialsError, 
  UserNotActiveError 
} = require('../../../shared/errors');

class LoginUseCase {
  constructor(userRepository, passwordHasher, tokenService) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.tokenService = tokenService;
  }

  async execute(input) {
    // 1. Tìm user by email
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    // 2. Verify password
    const isPasswordValid = await this.passwordHasher.compare(
      input.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // 3. Check user active
    if (!user.isActive()) {
      throw new UserNotActiveError();
    }

    // 4. Generate tokens
    const accessToken = await this.tokenService.generateAccessToken(user.id);
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);

    // 5. Return response
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl
      }
    };
  }
}

module.exports = LoginUseCase;