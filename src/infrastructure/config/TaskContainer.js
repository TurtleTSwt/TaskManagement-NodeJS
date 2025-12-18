const express = require('express');
const MySQLTaskRepository = require('../repositories/MySQLTaskRepository');
const MySQLTaskAssignmentRepository = require('../repositories/MySQLTaskAssignmentRepository');
const MySQLTaskCommentRepository = require('../repositories/MySQLTaskCommentRepository');

const CreateTaskUseCase = require('../../application/use-cases/task/CreateTaskUseCase');
const GetTasksUseCase = require('../../application/use-cases/task/GetTasksUseCase');
const GetTaskDetailUseCase = require('../../application/use-cases/task/GetTaskDetailUseCase');
const AssignTaskUseCase = require('../../application/use-cases/task/AssignTaskUseCase');
const DeleteTaskUseCase = require('../../application/use-cases/task/DeleteTaskUseCase');
// BỔ SUNG 2 DÒNG NÀY
const UpdateTaskUseCase = require('../../application/use-cases/task/UpdateTaskUseCase');
const UnassignTaskUseCase = require('../../application/use-cases/task/UnassignTaskUseCase');

const AddCommentUseCase = require('../../application/use-cases/task/AddCommentUseCase');
const GetTaskCommentsUseCase = require('../../application/use-cases/task/GetTaskCommentsUseCase');

const TaskController = require('../../presentation/http/controllers/TaskController');
const TaskCommentController = require('../../presentation/http/controllers/TaskCommentController');
const createTaskRouter = require('../../presentation/http/routes/task.routes');

class TaskContainer {
  constructor(db, authMiddleware, userRepository, emailService) {
    this.db = db;
    this.authMiddleware = authMiddleware;
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.initialize();
  }

  initialize() {
    this.taskRepository = new MySQLTaskRepository(this.db);
    this.taskAssignmentRepository = new MySQLTaskAssignmentRepository(this.db);
    this.taskCommentRepository = new MySQLTaskCommentRepository(this.db);

    this.createTaskUseCase = new CreateTaskUseCase(this.taskRepository);
    this.getTasksUseCase = new GetTasksUseCase(this.taskRepository);
    this.getTaskDetailUseCase = new GetTaskDetailUseCase(this.taskRepository, this.taskAssignmentRepository);
    this.assignTaskUseCase = new AssignTaskUseCase(this.taskRepository, this.taskAssignmentRepository, this.userRepository, this.emailService);
    this.deleteTaskUseCase = new DeleteTaskUseCase(this.taskRepository);
    // KHỞI TẠO THÊM
    this.updateTaskUseCase = new UpdateTaskUseCase(this.taskRepository);
    this.unassignTaskUseCase = new UnassignTaskUseCase(this.taskAssignmentRepository);

    this.addCommentUseCase = new AddCommentUseCase(this.taskRepository, this.taskCommentRepository);
    this.getTaskCommentsUseCase = new GetTaskCommentsUseCase(this.taskCommentRepository);

    // TRUYỀN ĐỦ 7 THAM SỐ
    this.taskController = new TaskController(
      this.createTaskUseCase,
      this.getTasksUseCase,
      this.getTaskDetailUseCase,
      this.assignTaskUseCase,
      this.deleteTaskUseCase,
      this.updateTaskUseCase,
      this.unassignTaskUseCase
    );

    this.taskCommentController = new TaskCommentController(
      this.addCommentUseCase,
      this.getTaskCommentsUseCase
    );
  }

  getRouter() {
    const router = express.Router();
    if (this.authMiddleware) {
      router.use(this.authMiddleware);
    }
    createTaskRouter(router, this.taskController, this.taskCommentController);
    return router;
  }
}

module.exports = TaskContainer;