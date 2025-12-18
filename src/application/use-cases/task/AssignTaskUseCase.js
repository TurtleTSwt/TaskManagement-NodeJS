const DomainError = require('../../../shared/errors/DomainError');

class AssignTaskUseCase {
  constructor(taskRepository, taskAssignmentRepository) {
    this.taskRepository = taskRepository;
    this.taskAssignmentRepository = taskAssignmentRepository;
  }

  async execute({ taskId, userId, currentUserId }) {
    if (!taskId || !userId || !currentUserId) {
      throw new DomainError('Missing required fields', 400, 'BAD_REQUEST');
    }

    // Check task tồn tại
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new DomainError('Task not found', 404, 'TASK_NOT_FOUND');
    }

    // Check đã assign chưa
    const existing =
      await this.taskAssignmentRepository.findByTaskIdAndUserId(taskId, userId);

    if (existing) {
      throw new DomainError(
        'User already assigned to this task',
        400,
        'ALREADY_ASSIGNED'
      );
    }

    const assignment = {
      taskId,
      userId,
      assignedBy: currentUserId
    };

    const createdAssignment =
      await this.taskAssignmentRepository.create(assignment);

    return {
      success: true,
      data: createdAssignment
    };
  }
}

module.exports = AssignTaskUseCase;
