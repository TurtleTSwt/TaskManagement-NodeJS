class AssignTaskDto {
  constructor({ taskId, userId }) {
    this.taskId = taskId;
    this.userId = userId;
  }

  static fromRequest(params, body) {
    return new AssignTaskDto({
      taskId: params.taskId,
      userId: body.userId
    });
  }
}

module.exports = AssignTaskDto;