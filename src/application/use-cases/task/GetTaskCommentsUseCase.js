class GetTaskCommentsUseCase {
  constructor(taskCommentService) {
    this.taskCommentService = taskCommentService;
  }

  async execute(taskId, page = 1, limit = 10) {
    return await this.taskCommentService.getCommentsByTaskId(
      Number(taskId),
      Number(page),
      Number(limit)
    );
  }
}

module.exports = GetTaskCommentsUseCase;
