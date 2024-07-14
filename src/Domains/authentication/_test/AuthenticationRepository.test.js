const AuthenticationRepository = require("../AuthenticationRepository");

describe("AuthenticationRepository", () => {
  it("should throw error when call abstract behavior", async () => {
    // Arrange
    const authenticationRepository = new AuthenticationRepository();

    // Action & Assert
    await expect(
      authenticationRepository.addToken("token")
    ).rejects.toThrowError("AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      authenticationRepository.verifyToken("token-123")
    ).rejects.toThrowError("AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
    await expect(
      authenticationRepository.deleteToken("token-123")
    ).rejects.toThrowError("AUTHENTICATION_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
