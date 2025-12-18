const MySQLConnection = require('../database/MySQLConnection');
const DomainError = require('../../shared/errors/DomainError');

class MySQLTaskAssignmentRepository {
  async assign(taskId, userId) {
    const pool = MySQLConnection.getPool();

    await pool.query(
      `INSERT INTO task_assignments (task_id, user_id)
       VALUES (?, ?)`,
      [taskId, userId]
    );
  }

  async unassign(taskId, userId) {
    const pool = MySQLConnection.getPool();

    await pool.query(
      `DELETE FROM task_assignments
       WHERE task_id = ? AND user_id = ?`,
      [taskId, userId]
    );
  }

  async getAssignees(taskId) {
    const pool = MySQLConnection.getPool();

    const [rows] = await pool.query(
      `SELECT user_id FROM task_assignments WHERE task_id = ?`,
      [taskId]
    );

    return rows.map(r => r.user_id);
  }
}

module.exports = MySQLTaskAssignmentRepository;
