const AuthTokenManager = require("../AuthTokenManager");
describe("authTokenManager class", () => {
  it("should throw error when invoke abstract behavior", async () => {
    // Action & Assert
    expect(() => {
      const authTokenManager = new AuthTokenManager();
      authTokenManager.createAccessToken({});
    }).toThrowError("AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
    expect(() => {
      const authTokenManager = new AuthTokenManager();
      authTokenManager.verifyRefreshToken({});
    }).toThrowError("AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
    expect(() => {
      const authTokenManager = new AuthTokenManager();
      authTokenManager.decodePayload({});
    }).toThrowError("AUTH_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED");
  });
});
