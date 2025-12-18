/**
 * Mapper chuyển đổi User entity sang response format
 */
class UserMapper {
  static toDTO(user) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      status: user.status,
      emailVerified: user.isEmailVerified(),
      createdAt: user.createdAt
    };
  }

  static toPublicDTO(user) {
    return {
      id: user.id,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl
    };
  }

  static toListDTO(users) {
    return users.map(user => this.toDTO(user));
  }

  static toAuthResponse(user, tokens) {
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    };
  }
}

module.exports = UserMapper;