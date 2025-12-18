// src/domain/entities/TaskAssignment.js

class TaskAssignment {
  constructor(
    id,
    taskId,
    userId,
    assignedBy,
    assignedAt = null,
    role = 'assignee',
    status = 'active',
    notes = null,
    createdAt = null,
    updatedAt = null
  ) {
    this.id = id;
    this.taskId = taskId;
    this.userId = userId;
    this.assignedBy = assignedBy;
    this.assignedAt = assignedAt || new Date();
    this.role = role; // 'assignee', 'reviewer', 'observer'
    this.status = status; // 'active', 'completed', 'removed'
    this.notes = notes;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();

    this.validate();
  }

  validate() {
    if (!this.id) {
      throw new Error('TaskAssignment ID is required');
    }

    if (!this.taskId) {
      throw new Error('Task ID is required');
    }

    if (!this.userId) {
      throw new Error('User ID is required');
    }

    if (!this.assignedBy) {
      throw new Error('Assigned by user ID is required');
    }

    const validRoles = ['assignee', 'reviewer', 'observer', 'owner'];
    if (!validRoles.includes(this.role)) {
      throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    const validStatuses = ['active', 'completed', 'removed'];
    if (!validStatuses.includes(this.status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }
  }

  /**
   * Update status
   */
  updateStatus(newStatus) {
    const validStatuses = ['active', 'completed', 'removed'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    this.status = newStatus;
    this.updatedAt = new Date();
  }

  /**
   * Update role
   */
  updateRole(newRole) {
    const validRoles = ['assignee', 'reviewer', 'observer', 'owner'];
    if (!validRoles.includes(newRole)) {
      throw new Error(`Invalid role: ${newRole}`);
    }

    this.role = newRole;
    this.updatedAt = new Date();
  }

  /**
   * Update notes
   */
  updateNotes(notes) {
    this.notes = notes;
    this.updatedAt = new Date();
  }

  /**
   * Mark as completed
   */
  markAsCompleted() {
    this.status = 'completed';
    this.updatedAt = new Date();
  }

  /**
   * Remove assignment
   */
  remove() {
    this.status = 'removed';
    this.updatedAt = new Date();
  }

  /**
   * Reactivate assignment
   */
  reactivate() {
    this.status = 'active';
    this.updatedAt = new Date();
  }

  /**
   * Check if assignment is active
   */
  isActive() {
    return this.status === 'active';
  }

  /**
   * Check if assignment is completed
   */
  isCompleted() {
    return this.status === 'completed';
  }

  /**
   * Check if user is assignee
   */
  isAssignee() {
    return this.role === 'assignee';
  }

  /**
   * Check if user is reviewer
   */
  isReviewer() {
    return this.role === 'reviewer';
  }

  /**
   * Check if user is owner
   */
  isOwner() {
    return this.role === 'owner';
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      id: this.id,
      taskId: this.taskId,
      userId: this.userId,
      assignedBy: this.assignedBy,
      assignedAt: this.assignedAt,
      role: this.role,
      status: this.status,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = TaskAssignment;