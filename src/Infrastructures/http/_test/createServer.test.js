const UserTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
describe("http server", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UserTableTestHelper.cleanTable();
  });

  describe("when POST /users", () => {
    it("should response 201 and persisted user", async () => {
      const reqPayload = {
        username: "mnzcreatee",
        password: "secret",
        fullname: "Ilman S",
      };

      const server = await createServer(container);
      //action
      const res = await server.inject({
        method: "POST",
        url: "/users",
        payload: reqPayload,
      });

      const resJson = JSON.parse(res.payload);
      expect(res.statusCode).toEqual(201);
      expect(resJson.status).toEqual("success");
      expect(resJson.data.addedUser).toBeDefined();
    });
  });
});
