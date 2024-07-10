class AuthTokenManager {
  createAccessToken() {
    throw new Error("AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  verifyRefreshToken() {
    throw new Error("AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }

  decodePayload() {
    throw new Error("AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = AuthTokenManager;
