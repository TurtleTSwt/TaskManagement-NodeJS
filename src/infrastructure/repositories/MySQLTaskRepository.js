const ITaskRepository = require('../../domain/repositories/ITaskRepository');
const MySQLConnection = require('../database/MySQLConnection');

class MySQLTaskRepository extends ITaskRepository {
  // ================= CREATE =================
  async create(taskData) {
    const pool = MySQLConnection.getPool();

    const [result] = await pool.query(
      `INSERT INTO tasks 
       (title, description, creator_id, group_id, status, priority, due_date, start_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        taskData.title,
        taskData.description || null,
        taskData.creatorId,
        taskData.groupId || null,
        taskData.status,
        taskData.priority,
        taskData.dueDate,
        taskData.startDate
      ]
    );

    return this.findById(result.insertId);
  }

  // ================= FIND BY ID =================
  async findById(id) {
    const pool = MySQLConnection.getPool();
    const [rows] = await pool.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );
    
    if (rows.length === 0) return null;

    const row = rows[0];
    return this._mapToEntity(row);
  }

  // ================= UPDATE =================
  async update(id, taskData) {
    const pool = MySQLConnection.getPool();
    const fields = [];
    const values = [];

    // Map các trường từ camelCase sang snake_case của DB
    const mapping = {
      title: 'title',
      description: 'description',
      status: 'status',
      priority: 'priority',
      dueDate: 'due_date',
      startDate: 'start_date',
      groupId: 'group_id',
      completedAt: 'completed_at'
    };

    for (const [key, dbColumn] of Object.entries(mapping)) {
      if (taskData[key] !== undefined) {
        fields.push(`${dbColumn} = ?`);
        values.push(taskData[key] === '' ? null : taskData[key]);
      }
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    await pool.query(
      `UPDATE tasks SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  // ================= FIND ALL =================
  async findAll(filters = {}) {
    const pool = MySQLConnection.getPool();
    let sql = 'SELECT * FROM tasks';
    const values = [];
    const conditions = [];

    if (filters.creatorId) {
      conditions.push('creator_id = ?');
      values.push(filters.creatorId);
    }
    if (filters.groupId) {
      conditions.push('group_id = ?');
      values.push(filters.groupId);
    }
    if (filters.status) {
      conditions.push('status = ?');
      values.push(filters.status);
    }
    if (filters.priority) {
      conditions.push('priority = ?');
      values.push(filters.priority);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql, values);
    return rows.map(row => this._mapToEntity(row));
  }

  // ================= DELETE =================
  async delete(id) {
    const pool = MySQLConnection.getPool();
    const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Helper function để chuyển đổi dữ liệu từ DB sang Code
  _mapToEntity(row) {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      creatorId: row.creator_id,
      groupId: row.group_id,
      status: row.status,
      priority: row.priority,
      dueDate: row.due_date,
      startDate: row.start_date,
      completedAt: row.completed_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

module.exports = MySQLTaskRepository;