const jwt = require('jsonwebtoken');
const ITokenService = require('../../application/interfaces/ITokenService');
const { InvalidTokenError } = require('../../shared/errors');

class JwtTokenService extends ITokenService {
  constructor() {
    super();
    this.accessTokenSecret = process.env.JWT_ACCESS_SECRET || 'access_secret_key_change_in_production';
    this.refreshTokenSecret = process.env.JWT_REFRESH_SECRET || 'refresh_secret_key_change_in_production';
    this.emailTokenSecret = process.env.JWT_EMAIL_SECRET || 'email_secret_key_change_in_production';
    
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
    this.emailTokenExpiry = '24h';
  }

  async generateAccessToken(userId) {
    return jwt.sign(
      { userId, type: 'access' },
      this.accessTokenSecret,
      { expiresIn: this.accessTokenExpiry }
    );
  }

  async generateRefreshToken(userId) {
    return jwt.sign(
      { userId, type: 'refresh' },
      this.refreshTokenSecret,
      { expiresIn: this.refreshTokenExpiry }
    );
  }

  async generateEmailToken(userId) {
    return jwt.sign(
      { userId, type: 'email_verification' },
      this.emailTokenSecret,
      { expiresIn: this.emailTokenExpiry }
    );
  }

  async verifyAccessToken(token) {
    try {
      const payload = jwt.verify(token, this.accessTokenSecret);
      if (payload.type !== 'access') {
        throw new InvalidTokenError();
      }
      return { userId: payload.userId };
    } catch (error) {
      throw new InvalidTokenError();
    }
  }

  async verifyRefreshToken(token) {
    try {
      const payload = jwt.verify(token, this.refreshTokenSecret);
      if (payload.type !== 'refresh') {
        throw new InvalidTokenError();
      }
      return { userId: payload.userId };
    } catch (error) {
      throw new InvalidTokenError();
    }
  }

  async verifyEmailToken(token) {
    try {
      const payload = jwt.verify(token, this.emailTokenSecret);
      if (payload.type !== 'email_verification') {
        throw new InvalidTokenError();
      }
      return { userId: payload.userId };
    } catch (error) {
      throw new InvalidTokenError();
    }
  }

  getRefreshTokenExpiry() {
    // Convert expiry string to milliseconds
    const match = this.refreshTokenExpiry.match(/(\d+)([dhms])/);
    if (!match) return 7 * 24 * 60 * 60 * 1000; // Default 7 days
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    const multipliers = {
      's': 1000,
      'm': 60 * 1000,
      'h': 60 * 60 * 1000,
      'd': 24 * 60 * 60 * 1000
    };
    
    return value * (multipliers[unit] || multipliers.d);
  }
}

module.exports = JwtTokenService;