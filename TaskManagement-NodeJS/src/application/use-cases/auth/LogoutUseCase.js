class LogoutUseCase {
  constructor(tokenService) {
    this.tokenService = tokenService;
  }

  async execute(refreshToken) {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    // Xác thực token trước khi xóa
    try {
      await this.tokenService.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }

    // Xóa refresh token khỏi database/cache
    await this.tokenService.revokeRefreshToken(refreshToken);

    return {
      success: true,
      message: 'Logged out successfully'
    };
  }
}

module.exports = LogoutUseCase;