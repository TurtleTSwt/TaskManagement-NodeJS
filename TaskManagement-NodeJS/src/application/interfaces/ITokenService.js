class ITokenService {
  async generateAccessToken(userId) {
    throw new Error('Method not implemented');
  }

  async generateRefreshToken(userId) {
    throw new Error('Method not implemented');
  }

  async verifyAccessToken(token) {
    throw new Error('Method not implemented');
  }

  async verifyRefreshToken(token) {
    throw new Error('Method not implemented');
  }
}

module.exports = ITokenService;