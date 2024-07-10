const AuthenticationRepository = require("../../../Domains/authentication/AuthenticatoinRepository");
const UserRepository = require("../../../Domains/users/UserRepository");

const AuthTokenManager = require("../../security/AuthTokenManager");
const PasswordHash = require("../../security/PasswordHash");
const AuthUseCase = require("../AuthUseCase");
describe("AuthUseCase", () => {
  describe("Do Login", () => {
    it("should orchestrating the login action correctly", async () => {
      const creds = {
        username: "menzcreate",
        password: "secret",
      };

      const tokens = {
        accessToken: "access_token",
        refreshToken: "refresh",
      };

      const mockUserRepo = new UserRepository();
      const mockAuthRepo = new AuthenticationRepository();
      const mockAuthManager = new AuthTokenManager();
      const mockPasswordHash = new PasswordHash();

      mockUserRepo.getUserByUsername = jest.fn().mockImplementation(() =>
        Promise.resolve({
          id: "user-123",
          username: "menzcreate",
          password: "encrypted",
        })
      );

      mockAuthManager.createAccessToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve(tokens.accessToken));

      mockAuthManager.createRefreshToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve(tokens.refreshToken));

      mockAuthRepo.addToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      mockPasswordHash.compare = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      // create use case instance
      const authUseCase = new AuthUseCase({
        userRepository: mockUserRepo,
        authRepository: mockAuthRepo,
        authTokenManager: mockAuthManager,
        passwordHash: mockPasswordHash,
      });

      // Action
      const auth = await authUseCase.doLogin(creds);

      expect(auth).toEqual(tokens);
      expect(mockUserRepo.getUserByUsername).toBeCalledWith(creds.username);
      expect(mockAuthManager.createAccessToken).toBeCalledWith({
        username: creds.username,
        id: "user-123",
      });
      expect(mockAuthManager.createRefreshToken).toBeCalledWith({
        username: creds.username,
        id: "user-123",
      });
      expect(mockAuthRepo.addToken).toBeCalledWith(tokens.refreshToken);
    });
  });

  describe("Regenerate Refresh Token", () => {
    it("should orchestrating the refresh token action correctly", async () => {
      const refreshToken = "refresh_token";

      const newTokens = {
        accessToken: "new_access",
        refreshToken: "new_refresh",
      };

      const mockTokenManager = new AuthTokenManager();
      const mockAuthRepo = new AuthenticationRepository();

      mockTokenManager.verifyRefreshToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      mockTokenManager.decodePayload = jest.fn().mockImplementation(() =>
        Promise.resolve({
          username: "menzcreate",
          id: "user-123",
        })
      );

      mockTokenManager.createAccessToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve(newTokens.accessToken));

      mockTokenManager.createRefreshToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve(newTokens.refreshToken));

      mockAuthRepo.deleteToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      // create use case instance
      const authUseCase = new AuthUseCase({
        authRepository: mockAuthRepo,
        authTokenManager: mockTokenManager,
      });

      // Action

      const auth = await authUseCase.renewRefreshToken({
        refreshToken,
      });

      expect(auth).toEqual(newTokens.accessToken);
      expect(mockTokenManager.verifyRefreshToken).toBeCalledWith(refreshToken);
      expect(mockTokenManager.decodePayload).toBeCalledWith(refreshToken);
    });

    it("should throw error if refresh token is not valid", async () => {
      const refreshToken = "refresh_token";

      const mockTokenManager = new AuthTokenManager();

      mockTokenManager.verifyRefreshToken = jest
        .fn()
        .mockImplementation(() =>
          Promise.reject(new Error("refresh token tidak valid"))
        );

      // create use case instance

      const authUseCase = new AuthUseCase({
        authTokenManager: mockTokenManager,
      });

      // Action

      await expect(
        authUseCase.renewRefreshToken({ refreshToken })
      ).rejects.toThrowError("refresh token tidak valid");
    });
  });

  describe("Logout", () => {
    it("should orchestrating the logout action correctly", async () => {
      const refreshToken = "refresh_token";

      const mockAuthRepo = new AuthenticationRepository();
      const mockTokenManager = new AuthTokenManager();

      mockAuthRepo.deleteToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve());
      mockTokenManager.verifyRefreshToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve());

      // create use case instance
      const authUseCase = new AuthUseCase({
        authRepository: mockAuthRepo,
        authTokenManager: mockTokenManager,
      });

      // Action

      await authUseCase.logout({ refreshToken });
      expect(mockTokenManager.verifyRefreshToken).toBeCalledWith(refreshToken);
      expect(mockAuthRepo.deleteToken).toBeCalledWith(refreshToken);
    });

    it("should throw error if refresh token is not valid", async () => {
      const refreshToken = "refresh_token";
      const mockTokenManager = new AuthTokenManager();
      const mockAuthRepo = new AuthenticationRepository();

      mockTokenManager.verifyRefreshToken = jest
        .fn()
        .mockImplementation(() =>
          Promise.reject(new Error("refresh token tidak valid"))
        );

      // create use case instance

      const authUseCase = new AuthUseCase({
        authTokenManager: mockTokenManager,
        authRepository: mockAuthRepo,
      });

      // Action

      await expect(authUseCase.logout({ refreshToken })).rejects.toThrowError(
        "refresh token tidak valid"
      );
    });
  });
});
