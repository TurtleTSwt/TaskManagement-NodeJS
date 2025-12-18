const User = require('../../domain/entities/User');
const Email = require('../../domain/value-objects/Email');

class MySQLUserRepository {
  constructor(dbConnection) {
    this.db = dbConnection;
  }

  async save(user) {
    const query = `
      INSERT INTO users (id, email, password, name, is_email_verified, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      user.id,
      user.email.value,
      user.password,
      user.name,
      user.isEmailVerified ? 1 : 0,
      user.createdAt,
      user.updatedAt
    ];

    try {
      const [result] = await this.db.execute(query, values);
      return user;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email already exists');
      }
      throw error;
    }
  }

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await this.db.execute(query, [id]);

    if (rows.length === 0) {
      return null;
    }

    return this.mapToEntity(rows[0]);
  }

  async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await this.db.execute(query, [email.value]);

    if (rows.length === 0) {
      return null;
    }

    return this.mapToEntity(rows[0]);
  }

  async update(user) {
    const query = `
      UPDATE users 
      SET email = ?, password = ?, name = ?, is_email_verified = ?, updated_at = ?
      WHERE id = ?
    `;

    const values = [
      user.email.value,
      user.password,
      user.name,
      user.isEmailVerified ? 1 : 0,
      new Date(),
      user.id
    ];

    const [result] = await this.db.execute(query, values);
    
    if (result.affectedRows === 0) {
      throw new Error('User not found');
    }

    return user;
  }

  async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await this.db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  async existsByEmail(email) {
    const query = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
    const [rows] = await this.db.execute(query, [email.value]);
    return rows[0].count > 0;
  }

  // Helper method để map từ database row sang domain entity
  mapToEntity(row) {
    return new User(
      row.id,
      new Email(row.email),
      row.password,
      row.name,
      Boolean(row.is_email_verified),
      row.created_at,
      row.updated_at
    );
  }
}

module.exports = MySQLUserRepository;