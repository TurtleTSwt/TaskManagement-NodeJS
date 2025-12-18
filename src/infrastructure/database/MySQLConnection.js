const mysql = require('mysql2/promise');

class MySQLConnection {
  constructor() {
    this.pool = null;
  }

  async connect() {
    if (!this.pool) {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'taskmanagement',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
      });

      console.log('MySQL connected successfully');
    }
    return this.pool;
  }

  getPool() {
    if (!this.pool) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.pool;
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      console.log('MySQL connection closed');
    }
  }
}

const instance = new MySQLConnection();

module.exports = instance;