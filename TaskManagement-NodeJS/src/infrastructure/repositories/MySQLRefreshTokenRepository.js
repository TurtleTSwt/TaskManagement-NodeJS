class MySQLRefreshTokenRepository {
  constructor(dbConnection) {
    this.db = dbConnection;
  }

  async create(tokenData) {
    await this.db.execute(
      `INSERT INTO refresh_tokens (id, user_id, token, expires_at, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        tokenData.id,
        tokenData.userId,
        tokenData.token,
        tokenData.expiresAt,
        new Date()
      ]
    );
  }

  async findByToken(token) {
    const [rows] = await this.db.execute(
      'SELECT * FROM refresh_tokens WHERE token = ?',
      [token]
    );

    if (rows.length === 0) return null;
    return rows[0];
  }

  async deleteByToken(token) {
    await this.db.execute(
      'DELETE FROM refresh_tokens WHERE token = ?',
      [token]
    );
  }

  async deleteByUserId(userId) {
    await this.db.execute(
      'DELETE FROM refresh_tokens WHERE user_id = ?',
      [userId]
    );
  }

  async deleteExpiredTokens() {
    await this.db.execute(
      'DELETE FROM refresh_tokens WHERE expires_at < NOW()'
    );
  }
}

module.exports = MySQLRefreshTokenRepository;