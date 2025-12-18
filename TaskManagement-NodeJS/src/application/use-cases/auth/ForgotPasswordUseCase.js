const { UserNotFoundError } = require('../../../shared/errors');
const IdGenerator = require('../../../shared/utils/IdGenerator');

class ForgotPasswordUseCase {
  constructor(userRepository, tokenService, emailService, passwordResetRepository) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.emailService = emailService;
    this.passwordResetRepository = passwordResetRepository;
  }

  async execute(input) {
    // 1. Tìm user by email
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      // Không throw error để tránh user enumeration attack
      // Nhưng vẫn return success
      return {
        success: true,
        message: 'If the email exists, a password reset link has been sent'
      };
    }

    // 2. Generate reset token
    const resetToken = IdGenerator.generate();
    
    // 3. Lưu reset token vào database (expire sau 1 giờ)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await this.passwordResetRepository.create({
      id: IdGenerator.generate(),
      userId: user.id,
      token: resetToken,
      expiresAt: expiresAt,
      used: false
    });

    // 4. Gửi email chứa reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await this.emailService.sendPasswordResetEmail(user.email, resetLink);

    return {
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    };
  }
}

module.exports = ForgotPasswordUseCase;