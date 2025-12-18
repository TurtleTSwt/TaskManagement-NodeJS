class TaskAssignment {
  constructor({
    id,
    taskId,
    userId,
    assignedBy,
    assignedAt = null
  }) {
    this.id = id;
    this.taskId = taskId;
    this.userId = userId;
    this.assignedBy = assignedBy;
    this.assignedAt = assignedAt || new Date();
  }
}

module.exports = TaskAssignment;