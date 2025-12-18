class UpdateTaskDto {
  constructor({ 
    title, 
    description, 
    status, 
    priority, 
    dueDate, 
    startDate 
  }) {
    this.title = title;
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.dueDate = dueDate;
    this.startDate = startDate;
  }

  static fromRequest(body) {
    return new UpdateTaskDto({
      title: body.title,
      description: body.description,
      status: body.status,
      priority: body.priority,
      dueDate: body.dueDate,
      startDate: body.startDate
    });
  }
}

module.exports = UpdateTaskDto;