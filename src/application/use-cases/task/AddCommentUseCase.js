const AddCommentDto = require('../../dtos/task/AddCommentDto');

class AddCommentUseCase {
  constructor(taskCommentService) {
    this.taskCommentService = taskCommentService;
  }

  async execute(data) {
    const dto = new AddCommentDto(data);

    if (!dto.content || !dto.content.trim()) {
      throw new Error('Comment content is required');
    }

    return await this.taskCommentService.addComment(
      dto.taskId,
      dto.userId,
      dto.content
    );
  }
}

module.exports = AddCommentUseCase;
