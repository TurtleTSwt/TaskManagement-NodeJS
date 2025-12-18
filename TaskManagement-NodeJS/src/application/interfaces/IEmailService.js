class IEmailService {
  async sendVerificationEmail(email, token) {
    throw new Error('Method not implemented');
  }

  async sendPasswordResetEmail(email, token) {
    throw new Error('Method not implemented');
  }

  async sendTaskAssignmentNotification(email, taskTitle, assignedBy) {
    throw new Error('Method not implemented');
  }
}

module.exports = IEmailService;