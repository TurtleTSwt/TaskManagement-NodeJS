const DomainError = require('../../../shared/errors/DomainError');

class CompleteTaskUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async execute({ taskId, completedBy }) {
    if (!taskId || !completedBy) {
      throw new DomainError('Missing required fields', 400, 'BAD_REQUEST');
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new DomainError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    return await this.taskRepository.complete(taskId, completedBy);
  }
}

module.exports = CompleteTaskUseCase;
