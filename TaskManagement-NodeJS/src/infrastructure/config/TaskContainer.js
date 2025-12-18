const MySQLTaskRepository = require('../repositories/MySQLTaskRepository');
const MySQLTaskAssignmentRepository = require('../repositories/MySQLTaskAssignmentRepository');
const MySQLTaskCommentRepository = require('../repositories/MySQLTaskCommentRepository');

const CreateTaskUseCase = require('../../application/use-cases/task/CreateTaskUseCase');
const UpdateTaskUseCase = require('../../application/use-cases/task/UpdateTaskUseCase');
const GetTasksUseCase = require('../../application/use-cases/task/GetTasksUseCase');
const AssignTaskUseCase = require('../../application/use-cases/task/AssignTaskUseCase');
const CompleteTaskUseCase = require('../../application/use-cases/task/CompleteTaskUseCase');
const DeleteTaskUseCase = require('../../application/use-cases/task/DeleteTaskUseCase');
const GetTaskDetailUseCase = require('../../application/use-cases/task/GetTaskDetailUseCase');

const TaskAssignmentService = require('../../application/services/TaskAssignmentService');

const TaskController = require('../../presentation/http/controllers/TaskController');
const createTaskRouter = require('../../presentation/http/routes/task.routes');

class TaskContainer {
  constructor(dbConnection, authMiddleware, userRepository, emailService) {
    this.db = dbConnection;
    this.authMiddleware = authMiddleware;
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.initializeDependencies();
  }

  initializeDependencies() {
    // ============ REPOSITORIES ============
    this.taskRepository = new MySQLTaskRepository(this.db);
    this.taskAssignmentRepository = new MySQLTaskAssignmentRepository(this.db);
    this.taskCommentRepository = new MySQLTaskCommentRepository(this.db);

    // ============ SERVICES ============
    this.taskAssignmentService = new TaskAssignmentService(
      this.taskAssignmentRepository
    );

    // ============ USE CASES ============
    this.createTaskUseCase = new CreateTaskUseCase(
      this.taskRepository,
      null, // groupRepository - sẽ được inject từ GroupContainer nếu cần
      this.userRepository
    );

    this.updateTaskUseCase = new UpdateTaskUseCase(
      this.taskRepository
    );

    this.getTasksUseCase = new GetTasksUseCase(
      this.taskRepository
    );

    this.assignTaskUseCase = new AssignTaskUseCase(
      this.taskRepository,
      this.taskAssignmentRepository,
      this.userRepository,
      this.emailService
    );

    this.completeTaskUseCase = new CompleteTaskUseCase(
      this.taskRepository,
      this.taskAssignmentRepository
    );

    this.deleteTaskUseCase = new DeleteTaskUseCase(
      this.taskRepository
    );

    this.getTaskDetailUseCase = new GetTaskDetailUseCase(
      this.taskRepository,
      this.taskAssignmentRepository,
      this.userRepository
    );

    // ============ CONTROLLER ============
    this.taskController = new TaskController(
      this.createTaskUseCase,
      this.updateTaskUseCase,
      this.getTasksUseCase,
      this.assignTaskUseCase,
      this.completeTaskUseCase,
      this.deleteTaskUseCase,
      this.getTaskDetailUseCase
    );
  }

  getTaskRouter() {
    return createTaskRouter(this.taskController, this.authMiddleware);
  }

  getTaskRepository() {
    return this.taskRepository;
  }
}

module.exports = TaskContainer;