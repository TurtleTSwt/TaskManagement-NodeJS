const bcrypt = require('bcrypt');
const IPasswordHasher = require('../../application/interfaces/IPasswordHasher');

class BcryptPasswordHasher extends IPasswordHasher {
  constructor() {
    super();
    this.saltRounds = 10;
  }

  async hash(password) {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async compare(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = BcryptPasswordHasher;