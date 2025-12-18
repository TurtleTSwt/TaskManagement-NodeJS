const DomainError = require('../../../shared/errors/DomainError');

class TaskController {
  constructor(
    createTaskUseCase,
    getTasksUseCase,
    getTaskDetailUseCase,
    assignTaskUseCase,
    deleteTaskUseCase,
    updateTaskUseCase,
    unassignTaskUseCase
  ) {
    // Bind đầy đủ (Sẽ không lỗi vì đã có hàm bên dưới)
    this.createTask = this.createTask.bind(this);
    this.updateTask = this.updateTask.bind(this); 
    this.getTasks = this.getTasks.bind(this);
    this.getTaskDetail = this.getTaskDetail.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.assignTask = this.assignTask.bind(this);
    this.unassignTask = this.unassignTask.bind(this);

    this.createTaskUseCase = createTaskUseCase;
    this.getTasksUseCase = getTasksUseCase;
    this.getTaskDetailUseCase = getTaskDetailUseCase;
    this.assignTaskUseCase = assignTaskUseCase;
    this.deleteTaskUseCase = deleteTaskUseCase;
    this.updateTaskUseCase = updateTaskUseCase;
    this.unassignTaskUseCase = unassignTaskUseCase;
  }

  async getTasks(req, res) {
    try {
      const filters = {
        creatorId: req.user.id,
        groupId: req.query.groupId ? Number(req.query.groupId) : undefined,
        status: req.query.status
      };
      const tasks = await this.getTasksUseCase.execute(filters);
      res.status(200).json({ success: true, data: tasks });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async createTask(req, res) {
    try {
      const taskData = { ...req.body, creatorId: req.user.id };
      const task = await this.createTaskUseCase.execute(taskData);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // THÊM THÂN HÀM UPDATE
  async updateTask(req, res) {
    try {
      const { taskId } = req.params;
      const task = await this.updateTaskUseCase.execute(
        Number(taskId),
        req.body,
        req.user.id
      );
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async getTaskDetail(req, res) {
    try {
      const { taskId } = req.params;
      const task = await this.getTaskDetailUseCase.execute(Number(taskId));
      res.status(200).json({ success: true, data: task });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async deleteTask(req, res) {
    try {
      const { taskId } = req.params;
      await this.deleteTaskUseCase.execute({ taskId: Number(taskId), userId: req.user.id });
      res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async assignTask(req, res) {
    try {
      const { taskId } = req.params;
      const { userId } = req.body;
      const result = await this.assignTaskUseCase.execute({
        taskId: Number(taskId),
        userId: Number(userId),
        currentUserId: req.user.id
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // THÊM THÂN HÀM UNASSIGN
  async unassignTask(req, res) {
    try {
      const { taskId, userId } = req.params;
      await this.unassignTaskUseCase.execute(Number(taskId), Number(userId));
      res.status(200).json({ success: true, message: 'Unassigned successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = TaskController;