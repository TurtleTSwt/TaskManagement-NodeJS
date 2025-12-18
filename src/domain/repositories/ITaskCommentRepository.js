class ITaskCommentRepository {
  async create(comment) {
    throw new Error('ITaskCommentRepository.create() not implemented');
  }

  async findByTaskId(taskId, pagination) {
    throw new Error('ITaskCommentRepository.findByTaskId() not implemented');
  }

  async delete(commentId) {
    throw new Error('ITaskCommentRepository.delete() not implemented');
  }
}

module.exports = ITaskCommentRepository;
