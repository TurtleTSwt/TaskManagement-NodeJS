const MySQLGroupRepository = require('../repositories/MySQLGroupRepository');
const MySQLUserGroupRepository = require('../repositories/MySQLUserGroupRepository');

const CreateGroupUseCase = require('../../application/use-cases/group/CreateGroupUseCase');
const UpdateGroupUseCase = require('../../application/use-cases/group/UpdateGroupUseCase');
const GetGroupsUseCase = require('../../application/use-cases/group/GetGroupsUseCase');
const AddMemberUseCase = require('../../application/use-cases/group/AddMemberUseCase');
const RemoveMemberUseCase = require('../../application/use-cases/group/RemoveMemberUseCase');

const GroupMemberService = require('../../application/services/GroupMemberService');

const GroupController = require('../../presentation/http/controllers/GroupController');
const createGroupRouter = require('../../presentation/http/routes/group.routes');

class GroupContainer {
  constructor(dbConnection, authMiddleware, userRepository, emailService) {
    this.db = dbConnection;
    this.authMiddleware = authMiddleware;
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.initializeDependencies();
  }

  initializeDependencies() {
    // ============ REPOSITORIES ============
    this.groupRepository = new MySQLGroupRepository(this.db);
    this.userGroupRepository = new MySQLUserGroupRepository(this.db);

    // ============ SERVICES ============
    this.groupMemberService = new GroupMemberService(
      this.groupRepository
    );

    // ============ USE CASES ============
    this.createGroupUseCase = new CreateGroupUseCase(
      this.groupRepository,
      this.userRepository
    );

    this.updateGroupUseCase = new UpdateGroupUseCase(
      this.groupRepository,
      this.groupMemberService
    );

    this.getGroupsUseCase = new GetGroupsUseCase(
      this.groupRepository
    );

    this.addMemberUseCase = new AddMemberUseCase(
      this.groupRepository,
      this.userRepository,
      this.emailService
    );

    this.removeMemberUseCase = new RemoveMemberUseCase(
      this.groupRepository,
      this.groupMemberService
    );

    // ============ CONTROLLER ============
    this.groupController = new GroupController(
      this.createGroupUseCase,
      this.updateGroupUseCase,
      this.getGroupsUseCase,
      this.addMemberUseCase,
      this.removeMemberUseCase
    );
  }

  getGroupRouter() {
    return createGroupRouter(this.groupController, this.authMiddleware);
  }

  getGroupRepository() {
    return this.groupRepository;
  }
}

module.exports = GroupContainer;