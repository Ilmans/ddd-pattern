const UserLogin = require("../../Domains/users/entities/UserLogin");

class AuthUseCase {
  constructor({
    userRepository,
    authRepository,
    authTokenManager,
    passwordHash,
  }) {
    this._userRepository = userRepository;
    this._authRepository = authRepository;
    this._authManager = authTokenManager;
    this._passwordHash = passwordHash;
  }

  async doLogin(creds) {
    const { username, password } = new UserLogin(creds);

    const user = await this._userRepository.getUserByUsername(username);

    await this._passwordHash.compare(password, user.password);

    const payload = { username, id: user.id };
    const accessToken = await this._authManager.createAccessToken(payload);
    const refreshToken = await this._authManager.createRefreshToken(payload);

    await this._authRepository.addToken(refreshToken);
    return { accessToken, refreshToken };
  }
}

module.exports = AuthUseCase;
