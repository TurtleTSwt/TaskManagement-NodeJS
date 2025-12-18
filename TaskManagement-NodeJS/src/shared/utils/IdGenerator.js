const { v4: uuidv4 } = require('uuid');

class IdGenerator {

  generateUUID() {
    return uuidv4();
  }

  generateShortId(length = 6) {
    const raw = uuidv4().replace(/-/g, '');
    const start = Math.floor(Math.random() * (raw.length - length));
    return raw.substring(start, start + length);
  }

  /**
   * Generate prefixed short ID
   * Example: user_a9f3c2
   */
  generatePrefixedId(prefix, length = 6) {
    if (!prefix) {
      throw new Error('Prefix is required');
    }
    return `${prefix}_${this.generateShortId(length)}`;
  }

 
  generateNumericId() {
    return Date.now() + Math.floor(Math.random() * 1000);
  }

  generate(options = {}) {
    const {
      type = 'short',
      prefix = null,
      length = 6
    } = options;

    switch (type) {
      case 'uuid':
        return this.generateUUID();

      case 'short':
        return this.generateShortId(length);

      case 'prefixed':
        return this.generatePrefixedId(prefix, length);

      case 'numeric':
        return this.generateNumericId();

      default:
        throw new Error(`Unknown ID type: ${type}`);
    }
  }

  
   //Validate full UUID v4
   
  isValidUUID(id) {
    const regex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(id);
  }

 
  generateUserId() {
    return this.generatePrefixedId('user', 6);
  }

  generateOrderId() {
    return this.generatePrefixedId('order', 6);
  }

  generateSessionId() {
    return this.generatePrefixedId('session', 6);
  }
}

module.exports = IdGenerator;
