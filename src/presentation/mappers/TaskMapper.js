/**
 * Mapper chuyển đổi Task entity sang response format
 */
class TaskMapper {
  static toDTO(task, options = {}) {
    const dto = {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      groupId: task.groupId,
      creatorId: task.creatorId,
      dueDate: task.dueDate,
      startDate: task.startDate,
      completedAt: task.completedAt,
      isOverdue: task.isOverdue(),
      isPersonal: task.isPersonalTask(),
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    };

    // Include creator info if provided
    if (options.includeCreator && options.creator) {
      dto.creator = {
        id: options.creator.id,
        fullName: options.creator.fullName,
        avatarUrl: options.creator.avatarUrl
      };
    }

    // Include assignees if provided
    if (options.includeAssignees && options.assignees) {
      dto.assignees = options.assignees.map(user => ({
        id: user.id,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl
      }));
    }

    // Include group info if provided
    if (options.includeGroup && options.group) {
      dto.group = {
        id: options.group.id,
        name: options.group.name
      };
    }

    return dto;
  }

  static toListDTO(tasks, options = {}) {
    return tasks.map(task => this.toDTO(task, options));
  }

  static toSummaryDTO(task) {
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      isOverdue: task.isOverdue()
    };
  }

  static toCreateResponse(task) {
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      priority: task.priority,
      createdAt: task.createdAt,
      message: 'Task created successfully'
    };
  }

  static toUpdateResponse(task) {
    return {
      id: task.id,
      title: task.title,
      status: task.status,
      updatedAt: task.updatedAt,
      message: 'Task updated successfully'
    };
  }
}

module.exports = TaskMapper;