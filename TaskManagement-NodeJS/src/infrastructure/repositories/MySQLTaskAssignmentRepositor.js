const TaskAssignment = require('../../domain/entities/TaskAssignment');

class MySQLTaskAssignmentRepository {
  constructor(dbConnection) {
    this.db = dbConnection;
  }

  /**
   * Lưu task assignment mới
   */
  async save(taskAssignment) {
    const query = `
      INSERT INTO task_assignments (
        id, task_id, user_id, assigned_by, assigned_at, 
        role, status, notes, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      taskAssignment.id,
      taskAssignment.taskId,
      taskAssignment.userId,
      taskAssignment.assignedBy,
      taskAssignment.assignedAt,
      taskAssignment.role || 'assignee',
      taskAssignment.status || 'active',
      taskAssignment.notes || null,
      taskAssignment.createdAt,
      taskAssignment.updatedAt
    ];

    try {
      const [result] = await this.db.execute(query, values);
      return taskAssignment;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Task assignment already exists');
      }
      throw error;
    }
  }

  /**
   * Tìm task assignment theo ID
   */
  async findById(id) {
    const query = `
      SELECT ta.*, 
             u.name as user_name, u.email as user_email,
             ab.name as assigned_by_name
      FROM task_assignments ta
      LEFT JOIN users u ON ta.user_id = u.id
      LEFT JOIN users ab ON ta.assigned_by = ab.id
      WHERE ta.id = ?
    `;
    
    const [rows] = await this.db.execute(query, [id]);

    if (rows.length === 0) {
      return null;
    }

    return this.mapToEntity(rows[0]);
  }

  /**
   * Tìm tất cả assignments của một task
   */
  async findByTaskId(taskId) {
    const query = `
      SELECT ta.*, 
             u.name as user_name, u.email as user_email,
             ab.name as assigned_by_name
      FROM task_assignments ta
      LEFT JOIN users u ON ta.user_id = u.id
      LEFT JOIN users ab ON ta.assigned_by = ab.id
      WHERE ta.task_id = ?
      ORDER BY ta.assigned_at DESC
    `;
    
    const [rows] = await this.db.execute(query, [taskId]);
    return rows.map(row => this.mapToEntity(row));
  }

  /**
   * Tìm tất cả tasks được assign cho một user
   */
  async findByUserId(userId) {
    const query = `
      SELECT ta.*, 
             t.title as task_title, t.status as task_status,
             ab.name as assigned_by_name
      FROM task_assignments ta
      LEFT JOIN tasks t ON ta.task_id = t.id
      LEFT JOIN users ab ON ta.assigned_by = ab.id
      WHERE ta.user_id = ?
      ORDER BY ta.assigned_at DESC
    `;
    
    const [rows] = await this.db.execute(query, [userId]);
    return rows.map(row => this.mapToEntity(row));
  }

  /**
   * Tìm active assignments của user
   */
  async findActiveByUserId(userId) {
    const query = `
      SELECT ta.*, 
             t.title as task_title, t.status as task_status, t.priority,
             ab.name as assigned_by_name
      FROM task_assignments ta
      LEFT JOIN tasks t ON ta.task_id = t.id
      LEFT JOIN users ab ON ta.assigned_by = ab.id
      WHERE ta.user_id = ? AND ta.status = 'active'
      ORDER BY t.priority DESC, ta.assigned_at DESC
    `;
    
    const [rows] = await this.db.execute(query, [userId]);
    return rows.map(row => this.mapToEntity(row));
  }

  /**
   * Tìm assignment cụ thể (task + user)
   */
  async findByTaskAndUser(taskId, userId) {
    const query = `
      SELECT ta.*, 
             u.name as user_name, u.email as user_email,
             ab.name as assigned_by_name
      FROM task_assignments ta
      LEFT JOIN users u ON ta.user_id = u.id
      LEFT JOIN users ab ON ta.assigned_by = ab.id
      WHERE ta.task_id = ? AND ta.user_id = ?
    `;
    
    const [rows] = await this.db.execute(query, [taskId, userId]);

    if (rows.length === 0) {
      return null;
    }

    return this.mapToEntity(rows[0]);
  }

  /**
   * Cập nhật task assignment
   */
  async update(taskAssignment) {
    const query = `
      UPDATE task_assignments 
      SET status = ?, role = ?, notes = ?, updated_at = ?
      WHERE id = ?
    `;

    const values = [
      taskAssignment.status,
      taskAssignment.role,
      taskAssignment.notes,
      new Date(),
      taskAssignment.id
    ];

    const [result] = await this.db.execute(query, values);
    
    if (result.affectedRows === 0) {
      throw new Error('Task assignment not found');
    }

    return taskAssignment;
  }

  /**
   * Xóa task assignment
   */
  async delete(id) {
    const query = 'DELETE FROM task_assignments WHERE id = ?';
    const [result] = await this.db.execute(query, [id]);
    return result.affectedRows > 0;
  }

  /**
   * Xóa assignment theo taskId và userId
   */
  async deleteByTaskAndUser(taskId, userId) {
    const query = 'DELETE FROM task_assignments WHERE task_id = ? AND user_id = ?';
    const [result] = await this.db.execute(query, [taskId, userId]);
    return result.affectedRows > 0;
  }

  /**
   * Xóa tất cả assignments của một task
   */
  async deleteByTaskId(taskId) {
    const query = 'DELETE FROM task_assignments WHERE task_id = ?';
    const [result] = await this.db.execute(query, [taskId]);
    return result.affectedRows;
  }

  /**
   * Kiểm tra user đã được assign task chưa
   */
  async isUserAssigned(taskId, userId) {
    const query = `
      SELECT COUNT(*) as count 
      FROM task_assignments 
      WHERE task_id = ? AND user_id = ? AND status = 'active'
    `;
    const [rows] = await this.db.execute(query, [taskId, userId]);
    return rows[0].count > 0;
  }

  /**
   * Đếm số assignments của một task
   */
  async countByTaskId(taskId) {
    const query = `
      SELECT COUNT(*) as count 
      FROM task_assignments 
      WHERE task_id = ? AND status = 'active'
    `;
    const [rows] = await this.db.execute(query, [taskId]);
    return rows[0].count;
  }

  /**
   * Đếm số tasks được assign cho user
   */
  async countByUserId(userId) {
    const query = `
      SELECT COUNT(*) as count 
      FROM task_assignments 
      WHERE user_id = ? AND status = 'active'
    `;
    const [rows] = await this.db.execute(query, [userId]);
    return rows[0].count;
  }

  /**
   * Lấy team members của một task
   */
  async getTaskTeam(taskId) {
    const query = `
      SELECT 
        ta.id as assignment_id,
        ta.role,
        ta.status,
        ta.assigned_at,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        ab.name as assigned_by_name
      FROM task_assignments ta
      LEFT JOIN users u ON ta.user_id = u.id
      LEFT JOIN users ab ON ta.assigned_by = ab.id
      WHERE ta.task_id = ? AND ta.status = 'active'
      ORDER BY ta.role, ta.assigned_at
    `;
    
    const [rows] = await this.db.execute(query, [taskId]);
    return rows;
  }

  /**
   * Lấy workload của user (số task đang active)
   */
  async getUserWorkload(userId) {
    const query = `
      SELECT 
        COUNT(*) as total_tasks,
        SUM(CASE WHEN t.priority = 'high' THEN 1 ELSE 0 END) as high_priority_tasks,
        SUM(CASE WHEN t.priority = 'medium' THEN 1 ELSE 0 END) as medium_priority_tasks,
        SUM(CASE WHEN t.priority = 'low' THEN 1 ELSE 0 END) as low_priority_tasks
      FROM task_assignments ta
      LEFT JOIN tasks t ON ta.task_id = t.id
      WHERE ta.user_id = ? 
        AND ta.status = 'active'
        AND t.status NOT IN ('completed', 'cancelled')
    `;
    
    const [rows] = await this.db.execute(query, [userId]);
    return rows[0];
  }

  /**
   * Bulk insert assignments
   */
  async bulkSave(taskAssignments) {
    if (taskAssignments.length === 0) {
      return [];
    }

    const query = `
      INSERT INTO task_assignments (
        id, task_id, user_id, assigned_by, assigned_at, 
        role, status, notes, created_at, updated_at
      )
      VALUES ?
    `;

    const values = taskAssignments.map(ta => [
      ta.id,
      ta.taskId,
      ta.userId,
      ta.assignedBy,
      ta.assignedAt,
      ta.role || 'assignee',
      ta.status || 'active',
      ta.notes || null,
      ta.createdAt,
      ta.updatedAt
    ]);

    try {
      const [result] = await this.db.query(query, [values]);
      return taskAssignments;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('One or more task assignments already exist');
      }
      throw error;
    }
  }

  /**
   * Update status hàng loạt
   */
  async bulkUpdateStatus(assignmentIds, newStatus) {
    const query = `
      UPDATE task_assignments 
      SET status = ?, updated_at = ?
      WHERE id IN (?)
    `;

    const [result] = await this.db.execute(query, [newStatus, new Date(), assignmentIds]);
    return result.affectedRows;
  }

  /**
   * Helper method: Map từ database row sang domain entity
   */
  mapToEntity(row) {
    const assignment = new TaskAssignment(
      row.id,
      row.task_id,
      row.user_id,
      row.assigned_by,
      row.assigned_at,
      row.role,
      row.status,
      row.notes,
      row.created_at,
      row.updated_at
    );

    // Thêm thông tin bổ sung nếu có
    if (row.user_name) {
      assignment.userName = row.user_name;
      assignment.userEmail = row.user_email;
    }
    
    if (row.assigned_by_name) {
      assignment.assignedByName = row.assigned_by_name;
    }

    if (row.task_title) {
      assignment.taskTitle = row.task_title;
      assignment.taskStatus = row.task_status;
    }

    return assignment;
  }
}

module.exports = MySQLTaskAssignmentRepository;