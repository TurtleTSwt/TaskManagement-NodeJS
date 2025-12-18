class TaskCommentController {
  constructor(addCommentUseCase, getTaskCommentsUseCase) {
    this.addComment = this.addComment.bind(this);
    this.getComments = this.getComments.bind(this);

    this.addCommentUseCase = addCommentUseCase;
    this.getCommentsUseCase = getTaskCommentsUseCase;
  }

  async addComment(req, res) {
    try {
      const { taskId } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      const comment = await this.addCommentUseCase.execute({
        taskId: Number(taskId),
        userId,
        content
      });

      res.status(201).json({
        success: true,
        data: comment
      });
    } catch (error) {
      throw error; // cho ErrorHandler xử lý
    }
  }

  async getComments(req, res) {
    try {
      const { taskId } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const comments = await this.getCommentsUseCase.execute(
        Number(taskId),
        { page, limit }
      );

      res.status(200).json({
        success: true,
        data: comments
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TaskCommentController;
