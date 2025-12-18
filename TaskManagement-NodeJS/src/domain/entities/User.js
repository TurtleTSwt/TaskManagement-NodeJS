class User {
  constructor({
    id,
    email,
    passwordHash,
    fullName,
    status,
    avatarUrl = null,
    emailVerifiedAt = null,
    createdAt = null,
    updatedAt = null
  }) {
    this.id = id;
    this.email = email;
    this.passwordHash = passwordHash;
    this.fullName = fullName;
    this.status = status;
    this.avatarUrl = avatarUrl;
    this.emailVerifiedAt = emailVerifiedAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isActive() {
    return this.status === 'active';
  }

  isEmailVerified() {
    return this.emailVerifiedAt !== null;
  }

  canAccessGroup(groupRole) {
    return groupRole !== 'viewer' || this.isActive();
  }

  verifyEmail() {
    this.emailVerifiedAt = new Date();
  }
}

module.exports = User;