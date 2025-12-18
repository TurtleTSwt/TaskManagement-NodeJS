const User = require('../../../domain/entities/User');
const Email = require('../../../domain/value-objects/Email');
const Password = require('../../../domain/value-objects/Password');

const IdGenerator = require('../../../shared/utils/IdGenerator');
const { EmailAlreadyExistsError } = require('../../../shared/errors');
const UserStatus = require('../../../shared/constants/UserStatus');

class RegisterUseCase {
  constructor(userRepository, passwordHasher, emailService) {
    this.userRepository = userRepository;
    this.passwordHasher = passwordHasher;
    this.emailService = emailService;
  }

  async execute(input) {
    //  1. Validate email format
    const email = new Email(input.email);
    
    //  2. Validate password
    const password = new Password(input.password);

    //  3. Check email đã tồn tại chưa
    const existingUser = await this.userRepository.findByEmail(email.getValue());
    if (existingUser) {
      throw new EmailAlreadyExistsError();
    }

    //  4. Hash password
    const hashedPassword = await this.passwordHasher.hash(password.getValue());

    //  5. Tạo user entity
    const idGenerator = new IdGenerator();
    const user = new User({
      
      id: IdGenerator.generate(),
      email: email.getValue(),
      passwordHash: hashedPassword,
      fullName: input.fullName,
      status: UserStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    //  6. Lưu vào database
    const savedUser = await this.userRepository.create(user);

    //  7. Gửi email xác thực (async, không chờ)
    this.emailService.sendVerificationEmail(savedUser.email)
      .catch(err = console.error('Failed to send verification email', err));

    //  8. Return response
    return {
      id: savedUser.id,
      email: savedUser.email,
      fullName: savedUser.fullName,
      status: savedUser.status,
      createdAt: savedUser.createdAt
    };
  }
}

module.exports = RegisterUseCase;