class MySQLPasswordResetRepository {
  constructor(dbConnection) {
    this.db = dbConnection;
  }

  async create(resetData) {
    await this.db.execute(
      `INSERT INTO password_resets (id, user_id, token, expires_at, used, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        resetData.id,
        resetData.userId,
        resetData.token,
        resetData.expiresAt,
        resetData.used || false,
        new Date()
      ]
    );
  }

  async findByToken(token) {
    const [rows] = await this.db.execute(
      'SELECT * FROM password_resets WHERE token = ?',
      [token]
    );

    if (rows.length === 0) return null;
    return rows[0];
  }

  async markAsUsed(id) {
    await this.db.execute(
      'UPDATE password_resets SET used = TRUE WHERE id = ?',
      [id]
    );
  }

  async deleteByUserId(userId) {
    await this.db.execute(
      'DELETE FROM password_resets WHERE user_id = ?',
      [userId]
    );
  }

  async deleteExpiredTokens() {
    await this.db.execute(
      'DELETE FROM password_resets WHERE expires_at < NOW()'
    );
  }
}

module.exports = MySQLPasswordResetRepository;