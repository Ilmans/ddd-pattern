const InvariantError = require("../../Commons/exceptions/InvariantError");
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
    this._validatePayloadRefreshToken(payload);
    const { refreshToken } = payload;

    await this._authManager.verifyRefreshToken(refreshToken);
    const { username, id } = await this._authManager.decodePayload(
      refreshToken
    );

    return this._authManager.createAccessToken({ username, id });
  }

  // logout action
  async logout(payload) {
    this._validatePayloadRefreshToken(payload);
    const { refreshToken } = payload;
    await this._authManager.verifyRefreshToken(refreshToken);
    await this._authRepository.deleteToken(refreshToken);
    return;
  }

  // verify token
  _validatePayloadRefreshToken(payload) {
    const { refreshToken } = payload;
    if (!refreshToken) {
      throw new Error(
        "REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN"
      );
    }

    if (typeof refreshToken !== "string") {
      throw new Error(
        "REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION"
      );
    }
  }
}

module.exports = AuthUseCase;
