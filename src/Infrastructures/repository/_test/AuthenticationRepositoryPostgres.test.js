const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const InvariantError = require("../../../Commons/exceptions/InvariantError");
const pool = require("../../database/postgres/pool");
const AuthenticationRepositoryPostgres = require("../AuthenticationRepositoryPostgres");
describe("AuthenticationRepositoryPostgres", () => {
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addToken function", () => {
    it("should add token to authentications table", async () => {
      const token = "sadfjlma";
      const authenticationRepositoryPostgres =
        new AuthenticationRepositoryPostgres(pool, {});

      // add token
      await authenticationRepositoryPostgres.addToken(token);

      // find token
      const tokens = await AuthenticationsTableTestHelper.findToken(token);

      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBe(token);
    });
  });

  describe("verifyToken function", () => {
    it("should throw InvariantError if token not available", async () => {
      const token = "asdfasdfdsaasdf";
      const authenticationRepositoryPostgres =
        new AuthenticationRepositoryPostgres(pool, {});

      await expect(
        authenticationRepositoryPostgres.verifyToken(token)
      ).rejects.toThrowError(InvariantError);
    });

    it("should not throw InvariantError if token available", async () => {
      const token = "asdaj";
      const authenticationRepositoryPostgres =
        new AuthenticationRepositoryPostgres(pool, {});

      // add token
      await AuthenticationsTableTestHelper.addToken(token);

      expect(
        authenticationRepositoryPostgres.verifyToken(token)
      ).resolves.not.toThrowError(InvariantError);
    });
  });

  describe("deleteToken function", () => {
    it("should delete token from authentications table", async () => {
      const token = "asdfasf";
      const authenticationRepositoryPostgres =
        new AuthenticationRepositoryPostgres(pool, {});

      // add token
      await AuthenticationsTableTestHelper.addToken(token);
      // delete token
      await authenticationRepositoryPostgres.deleteToken(token);

      // find token
      const tokens = await AuthenticationsTableTestHelper.findToken(token);

      expect(tokens).toHaveLength(0);
    });
  });
});
