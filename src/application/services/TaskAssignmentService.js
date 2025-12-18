/**
 * Service xử lý logic liên quan đến task assignment
 */
class TaskAssignmentService {
  constructor(taskAssignmentRepository) {
    this.taskAssignmentRepository = taskAssignmentRepository;
  }

  async getAssignedUsers(taskId) {
    return await this.taskAssignmentRepository.findByTask(taskId);
  }

  async getTasksByAssignee(userId) {
    return await this.taskAssignmentRepository.findByUser(userId);
  }

  async isUserAssigned(taskId, userId) {
    const assignment = await this.taskAssignmentRepository.findByTaskAndUser(
      taskId, 
      userId
    );
    return assignment !== null;
  }

  async removeAssignment(taskId, userId) {
    await this.taskAssignmentRepository.deleteByTaskAndUser(taskId, userId);
  }
}

module.exports = TaskAssignmentService;