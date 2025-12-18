export default class DeleteTaskDto {
  constructor({ taskId, userId }) {
    this.taskId = taskId;
    this.userId = userId; // người thực hiện xóa (để check quyền nếu cần)
  }
}