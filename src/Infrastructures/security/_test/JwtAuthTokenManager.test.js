const InvariantError = require("../../../Commons/exceptions/InvariantError");
const JwtAuthTokenManager = require("../JwtAuthTokenManager");
const Jwt = require("@hapi/jwt");

describe("jwtAuthTokenManager class", () => {
  describe("createAccessToken", () => {
    it("should create access token correctly", async () => {
      const payload = {
        username: "menzcreate",
      };
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => "mock_token"),
      };

      const jwtTokenManager = new JwtAuthTokenManager(mockJwtToken);
      const accessToken = await jwtTokenManager.createAccessToken(payload);
      expect(mockJwtToken.generate).toBeCalledWith(
        payload,
        process.env.ACCESS_TOKEN_KEY
      );

      expect(accessToken).toEqual("mock_token");
    });
  });

  describe("createRefreshToken", () => {
    it("should create refresh token correctly", async () => {
      const payload = {
        username: "menzcreate",
      };
      const mockJwtToken = {
        generate: jest.fn().mockImplementation(() => "mock_token"),
      };

      const jwtTokenManager = new JwtAuthTokenManager(mockJwtToken);
      const refreshToken = await jwtTokenManager.createRefreshToken(payload);
      expect(mockJwtToken.generate).toBeCalledWith(
        payload,
        process.env.REFRESH_TOKEN_KEY
      );
      expect(refreshToken).toEqual("mock_token");
    });
  });

  describe("verifyRefreshToken", () => {
    it("should throw InvariantError when verification failed", async () => {
      const jwtTokenManager = new JwtAuthTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager.createAccessToken({
        username: "menzcreate",
      });

      await expect(
        jwtTokenManager.verifyRefreshToken(accessToken)
      ).rejects.toThrow(InvariantError);
    });

    it("should not throw InvariantError when refresh token verified", async () => {
      const jwtTokenManager = new JwtAuthTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.createRefreshToken({
        username: "menzcreate",
      });

      await expect(
        jwtTokenManager.verifyRefreshToken(refreshToken)
      ).resolves.not.toThrow();
    });
  });

  describe("decodePayload", () => {
    it("should decode payload correctly", async () => {
      const mockJwtToken = {
        decode: jest.fn().mockImplementation(() => ({
          decoded: {
            payload: {
              username: "menzcreate",
            },
          },
        })),
      };

      const jwtTokenManager = new JwtAuthTokenManager(mockJwtToken);
      const payload = await jwtTokenManager.decodePayload("mock_token");
      expect(mockJwtToken.decode).toBeCalledWith("mock_token");
      expect(payload).toEqual({ username: "menzcreate" });
    });
  });
});
