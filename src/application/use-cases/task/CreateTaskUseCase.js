const Task = require('../../../domain/entities/Task');
// Xóa require IdGenerator nếu không dùng ở nơi khác trong file này

class CreateTaskUseCase {
  constructor(taskRepository, groupRepository, userRepository) {
    this.taskRepository = taskRepository;
    this.groupRepository = groupRepository;
    this.userRepository = userRepository;
  }

  async execute(input, userId) {
    // 1. Validate group (nếu có)
    if (input.groupId) {
      const group = await this.groupRepository.findById(input.groupId);
      if (!group) {
        throw new Error('Group not found'); // Hoặc GroupNotFoundError nếu đã import
      }

      const memberRole = await this.groupRepository.getMemberRole(input.groupId, userId);
      if (!memberRole) {
        throw new Error('Forbidden: You are not a member of this group');
      }
    }

    // 2. Tạo task entity (KHÔNG truyền ID để MySQL tự tạo)
    const task = new Task({
      title: input.title,
      description: input.description || '',
      creatorId: userId,
      status: input.status || 'todo', // Sử dụng input hoặc mặc định todo
      priority: input.priority || 'medium',
      groupId: input.groupId || null,
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
      startDate: input.startDate ? new Date(input.startDate) : null,
    });

    // 3. Lưu task
    const savedTask = await this.taskRepository.create(task);

    // 4. Return response
    return savedTask; 
  }
}

module.exports = CreateTaskUseCase;