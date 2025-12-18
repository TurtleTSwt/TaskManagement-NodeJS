// Đảm bảo các file TaskNotFoundError và ForbiddenError tồn tại trong thư mục errors
const { TaskNotFoundError, ForbiddenError } = require('../../../shared/errors');

class UpdateTaskUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute(taskId, input, userId) {
    // 1. Tìm task
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new TaskNotFoundError();
    }

    // 2. Check quyền (chỉ creator mới được update)
    if (task.creatorId !== userId) {
      throw new ForbiddenError();
    }

    // 3. Update thông tin (Sử dụng các phương thức của Domain Entity Task)
    if (input.title !== undefined) task.title = input.title;
    if (input.description !== undefined) task.description = input.description;
    if (input.status !== undefined) {
       // Giả sử entity Task của bạn có hàm updateStatus để kiểm tra logic chuyển đổi trạng thái
       if (typeof task.updateStatus === 'function') {
         task.updateStatus(input.status);
       } else {
         task.status = input.status;
       }
    }
    if (input.priority !== undefined) task.priority = input.priority;
    if (input.dueDate !== undefined) task.dueDate = input.dueDate ? new Date(input.dueDate) : null;
    if (input.startDate !== undefined) task.startDate = input.startDate ? new Date(input.startDate) : null;
    
    task.updatedAt = new Date();

    // 4. Lưu vào cơ sở dữ liệu qua Repository
    const updatedTask = await this.taskRepository.update(task);

    return {
      id: updatedTask.id,
      title: updatedTask.title,
      description: updatedTask.description,
      status: updatedTask.status,
      priority: updatedTask.priority,
      dueDate: updatedTask.dueDate,
      updatedAt: updatedTask.updatedAt
    };
  }
}

module.exports = UpdateTaskUseCase;