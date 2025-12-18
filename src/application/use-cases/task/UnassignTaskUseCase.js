// src/application/use-cases/task/UnassignTaskUseCase.js
const { DomainError } = require('../../../shared/errors');

class UnassignTaskUseCase {
  constructor(taskAssignmentRepository) {
    this.taskAssignmentRepository = taskAssignmentRepository;
  }

  async execute(taskId, userId) {
    const assignment = await this.taskAssignmentRepository.findByTaskIdAndUserId(taskId, userId);
    if (!assignment) {
      throw new DomainError('Assignment not found', 404, 'ASSIGNMENT_NOT_FOUND');
    }

    await this.taskAssignmentRepository.delete(assignment.id);
    return { success: true };
  }
}

// Dùng module.exports
module.exports = UnassignTaskUseCase;