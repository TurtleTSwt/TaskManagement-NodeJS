export default class CreateTaskDto {
  constructor(data) {
    this.title = data.title?.trim();
    this.description = data.description?.trim() || null;
    this.creatorId = Number(data.creatorId); // từ req.user.id
    this.groupId = data.groupId ? Number(data.groupId) : null; // nullable
    this.status = data.status || 'todo';
    this.priority = data.priority || 'medium';
    this.dueDate = data.dueDate || null; // ISO string hoặc null
    this.startDate = data.startDate || null;
  }

  // Phương thức validate đơn giản (có thể dùng Joi ở validator layer)
  validate() {
    if (!this.title || this.title.length < 3) {
      throw new Error('Title must be at least 3 characters');
    }
    if (!this.creatorId || isNaN(this.creatorId)) {
      throw new Error('Valid creatorId is required');
    }
    if (this.groupId !== null && isNaN(this.groupId)) {
      throw new Error('groupId must be a valid number or null');
    }
    // Các validate khác nếu cần
  }
}