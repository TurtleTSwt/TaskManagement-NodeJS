export default class TaskCommentService {
  constructor(taskCommentRepository) {
    this.taskCommentRepository = taskCommentRepository;
  }

  async addComment(taskId, userId, content) {
    const comment = {
      taskId,
      userId,
      content,
      createdAt: new Date(),
    };
    return await this.taskCommentRepository.create(comment);
  }

  async getCommentsByTaskId(taskId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return await this.taskCommentRepository.findByTaskId(taskId, { limit, offset });
  }
}