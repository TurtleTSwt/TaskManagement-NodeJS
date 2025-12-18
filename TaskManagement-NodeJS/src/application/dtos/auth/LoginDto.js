class LoginDto {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }

  static fromRequest(body) {
    return new LoginUserDto({
      email: body.email,
      password: body.password
    });
  }
}

module.exports = LoginDto;