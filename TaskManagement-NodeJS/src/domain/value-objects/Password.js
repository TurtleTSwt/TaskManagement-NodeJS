class Password {
  constructor(password) {
    this.MIN_LENGTH = 8;
    this.value = password;
    this.validate();
  }

  validate() {
    if (this.value.length < this.MIN_LENGTH) {
      throw new Error(`Password must be at least ${this.MIN_LENGTH} characters`);
    }

    // Kiểm tra có chữ hoa
    if (!/[A-Z]/.test(this.value)) {
      throw new Error('Password must contain at least one uppercase letter');
    }

    // Kiểm tra có số
    if (!/[0-9]/.test(this.value)) {
      throw new Error('Password must contain at least one number');
    }
  }

  getValue() {
    return this.value;
  }
}

module.exports = Password;