const RegisterUser = require("../../Domains/users/entities/RegisterUser");

class AddUserUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyAvailableUsername(registerUser.username);
    const hashedPassword = await this._passwordHash.hash(registerUser.password);
    registerUser.password = hashedPassword;
    return this._userRepository.addUser(registerUser);
  }
}

module.exports = AddUserUseCase;
