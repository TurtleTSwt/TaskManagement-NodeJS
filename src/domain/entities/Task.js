class Task {
  constructor({
    id,
    title,
    description,
    creatorId,
    status = 'todo',
    priority = 'medium',
    groupId = null,
    dueDate = null,
    startDate = null,
    completedAt = null,
    createdAt = null,
    updatedAt = null
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.creatorId = creatorId;
    this.status = status;
    this.priority = priority;
    this.groupId = groupId;
    this.dueDate = dueDate;
    this.startDate = startDate;
    this.completedAt = completedAt;
    // Đảm bảo luôn có giá trị ngày tháng
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  isOverdue() {
    // Trạng thái 'done' là đã hoàn thành, không tính là trễ hạn
    if (!this.dueDate || this.status === 'done') {
      return false;
    }
    return new Date() > new Date(this.dueDate);
  }

  canBeCompleted() {
    // Không thể hoàn thành nếu đã hủy hoặc đã xong rồi
    return this.status !== 'cancelled' && this.status !== 'done';
  }

  complete() {
    if (!this.canBeCompleted()) {
      throw new Error('Task cannot be completed');
    }
    this.status = 'done';
    this.completedAt = new Date();
    this.updatedAt = new Date();
  }

  updateStatus(newStatus) {
    const validStatuses = ['todo', 'in_progress', 'review', 'done', 'cancelled'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }
    this.status = newStatus;
    this.updatedAt = new Date();
    
    // Tự động cập nhật completedAt nếu chuyển sang trạng thái done
    if (newStatus === 'done') {
      this.completedAt = new Date();
    }
  }

  isPersonalTask() {
    return this.groupId === null;
  }
}

module.exports = Task;