class ITaskRepository {
  async findById(id) {
    throw new Error('Method not implemented');
  }

  async findByCreator(creatorId) {
    throw new Error('Method not implemented');
  }

  async findByGroup(groupId) {
    throw new Error('Method not implemented');
  }

  async findByAssignee(userId) {
    throw new Error('Method not implemented');
  }

  async create(task) {
    throw new Error('Method not implemented');
  }

  async update(task) {
    throw new Error('Method not implemented');
  }

  async delete(id) {
    throw new Error('Method not implemented');
  }

  async findOverdueTasks() {
    throw new Error('Method not implemented');
  }
}

module.exports = ITaskRepository;