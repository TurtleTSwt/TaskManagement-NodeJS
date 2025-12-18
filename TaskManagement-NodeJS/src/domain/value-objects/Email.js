class Email {
  constructor(email) {
    if (!this.isValid(email)) {
      throw new Error('Invalid email format');
    }
    this.value = email.toLowerCase().trim();
  }

  isValid(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  getValue() {
    return this.value;
  }

  equals(other) {
    return this.value === other.value;
  }
}

module.exports = Email;