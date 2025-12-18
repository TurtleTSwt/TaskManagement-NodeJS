const DomainError = require('../../../shared/errors/DomainError');

class DeleteTaskUseCase {
  constructor(taskRepository, taskAssignmentRepository) {
    this.taskRepository = taskRepository;
    this.taskAssignmentRepository = taskAssignmentRepository;
  }

  async execute({ taskId, userId }) {
    if (!taskId || !userId) {
      throw new DomainError('Missing required fields', 400, 'BAD_REQUEST');
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new DomainError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    // Kiểm tra quyền xoá (creator)
    if (task.creator_id !== userId) {
      throw new DomainError('Forbidden', 403, 'FORBIDDEN');
    }

    // Xoá assignment trước (tránh FK constraint)
    const assignments =
      await this.taskAssignmentRepository.findByTaskId(taskId);

    for (const assignment of assignments) {
      await this.taskAssignmentRepository.delete(assignment.id);
    }

    // Xoá task
    await this.taskRepository.delete(taskId);

    return { success: true };
  }
}

module.exports = DeleteTaskUseCase;
