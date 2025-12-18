const TaskValidator = require('../../validators/TaskValidator');

// Nhận thêm tham số 'router' từ Container truyền vào
module.exports = function createTaskRouter(
  router, 
  taskController,
  taskCommentController
) {
  // KHÔNG khởi tạo const router = express.Router() ở đây nữa 
  // vì đã dùng router được truyền vào từ TaskContainer

  // TASK ROUTES
  router.post('/', TaskValidator.create, taskController.createTask);
  router.put('/:taskId', TaskValidator.update, taskController.updateTask);
  router.get('/', taskController.getTasks);
  router.get('/:taskId', taskController.getTaskDetail);

  // Assign & Unassign
  router.post(
    '/:taskId/assign',
    TaskValidator.assign,
    taskController.assignTask
  );

  router.delete(
    '/:taskId/unassign/:userId',
    TaskValidator.unassign,
    taskController.unassignTask
  );

  // Delete task
  router.delete(
    '/:taskId',
    TaskValidator.deleteTask,
    taskController.deleteTask
  );

  // COMMENT ROUTES
  if (taskCommentController) {
    router.post(
      '/:taskId/comments',
      TaskValidator.addComment,
      taskCommentController.addComment
    );

    router.get(
      '/:taskId/comments',
      TaskValidator.getComments,
      taskCommentController.getComments
    );
  }

  return router;
};