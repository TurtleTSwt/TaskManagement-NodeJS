class GetTasksUseCase {
  constructor(taskRepository) {
    this.taskRepository = taskRepository;
  }

  async getByUser(userId) {
    const tasks = await this.taskRepository.findByCreator(userId);
    return this.mapTasks(tasks);
  }

  async getByAssignee(userId) {
    const tasks = await this.taskRepository.findByAssignee(userId);
    return this.mapTasks(tasks);
  }

  async getByGroup(groupId) {
    const tasks = await this.taskRepository.findByGroup(groupId);
    return this.mapTasks(tasks);
  }

  async getOverdueTasks() {
    const tasks = await this.taskRepository.findOverdueTasks();
    return this.mapTasks(tasks);
  }

  mapTasks(tasks) {
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      groupId: task.groupId,
      dueDate: task.dueDate,
      isOverdue: task.isOverdue(),
      createdAt: task.createdAt
    }));
  }
}

module.exports = GetTasksUseCase;