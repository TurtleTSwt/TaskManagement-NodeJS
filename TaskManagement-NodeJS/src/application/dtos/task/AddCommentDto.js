class AddCommentDto {
  constructor({ taskId, userId, content }) {
    this.taskId = Number(taskId);
    this.userId = Number(userId);
    this.content = content;
  }
}

module.exports = AddCommentDto;
