class ITaskAssignmentRepository {
  async create(taskAssignment) {
    throw new Error('ITaskAssignmentRepository.create() not implemented');
  }

  async findByTaskId(taskId) {
    throw new Error('ITaskAssignmentRepository.findByTaskId() not implemented');
  }

  async findByTaskIdAndUserId(taskId, userId) {
    throw new Error('ITaskAssignmentRepository.findByTaskIdAndUserId() not implemented');
  }

  async delete(taskAssignmentId) {
    throw new Error('ITaskAssignmentRepository.delete() not implemented');
  }
}

module.exports = ITaskAssignmentRepository;
