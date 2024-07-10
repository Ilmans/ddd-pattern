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

  // login action
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

  // renew refresh token
  async renewRefreshToken(payload) {
    const { refreshToken } = payload;
    if (!refreshToken)
      throw new InvariantError(
        "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
      );

    await this._authManager.verifyRefreshToken(refreshToken);
    const { username, id } = await this._authManager.decodePayload(
      refreshToken
    );

    return this._authManager.createAccessToken({ username, id });
  }
}

module.exports = AuthUseCase;
