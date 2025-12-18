const Password = require('../../../domain/value-objects/Password');

class ResetPasswordUseCase {
  constructor(userRepository, tokenService, passwordHasher) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
    this.passwordHasher = passwordHasher;
  }

  async execute(resetToken, newPasswordString) {
    if (!resetToken) {
      throw new Error('Reset token is required');
    }

    // Xác thực token
    let payload;
    try {
      payload = await this.tokenService.verifyPasswordResetToken(resetToken);
    } catch (error) {
      throw new Error('Invalid or expired reset token');
    }

    // Tìm user
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Validate và hash password mới
    const newPassword = new Password(newPasswordString);
    const hashedPassword = await this.passwordHasher.hash(newPassword.value);

    // Cập nhật password
    user.changePassword(hashedPassword);
    await this.userRepository.update(user);

    // Revoke token sau khi dùng
    await this.tokenService.revokePasswordResetToken(resetToken);

    return {
      success: true,
      message: 'Password reset successfully'
    };
  }
}

module.exports = ResetPasswordUseCase;