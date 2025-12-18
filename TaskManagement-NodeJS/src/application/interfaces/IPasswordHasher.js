class IPasswordHasher {
  async hash(password) {
    throw new Error('Method not implemented');
  }

  async compare(password, hash) {
    throw new Error('Method not implemented');
  }
}

module.exports = IPasswordHasher;