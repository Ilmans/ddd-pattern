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

      mockUserRepo.getUser = jest.fn().mockImplementation(() =>
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
      expect(mockUserRepo.getUser).toBeCalledWith(creds.username);
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
});
