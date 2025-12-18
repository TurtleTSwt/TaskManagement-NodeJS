const ITaskCommentRepository = require('../../domain/repositories/ITaskCommentRepository');
const MySQLConnection = require('../database/MySQLConnection');

class MySQLTaskCommentRepository extends ITaskCommentRepository {
  async create(comment) {
    const pool = MySQLConnection.getPool();

    const [result] = await pool.query(
      'INSERT INTO task_comments (task_id, user_id, content, parent_id) VALUES (?, ?, ?, ?)',
      [
        comment.taskId,
        comment.userId,
        comment.content,
        comment.parentId || null
      ]
    );

    return { id: result.insertId, ...comment };
  }

  async findByTaskId(taskId, { limit = 20, offset = 0 } = {}) {
    const pool = MySQLConnection.getPool();

    const [rows] = await pool.query(
      `SELECT tc.*, u.full_name AS user_name, u.avatar_url
       FROM task_comments tc
       JOIN users u ON tc.user_id = u.id
       WHERE tc.task_id = ?
       ORDER BY tc.created_at DESC
       LIMIT ? OFFSET ?`,
      [taskId, limit, offset]
    );

    return rows;
  }

  async delete(commentId) {
    const pool = MySQLConnection.getPool();

    await pool.query(
      'DELETE FROM task_comments WHERE id = ?',
      [commentId]
    );
  }
}

module.exports = MySQLTaskCommentRepository;
