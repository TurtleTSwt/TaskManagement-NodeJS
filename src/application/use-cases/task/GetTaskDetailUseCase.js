const DomainError = require('../../../shared/errors/DomainError');

class GetTaskDetailUseCase {
  constructor(taskRepository, taskAssignmentRepository) {
    this.taskRepository = taskRepository;
    this.taskAssignmentRepository = taskAssignmentRepository;
  }

  async execute(taskId) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new DomainError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    const assignments =
      await this.taskAssignmentRepository.findByTaskId(taskId);

    task.assignments = assignments;

    return task;
  }
}

module.exports = GetTaskDetailUseCase;
