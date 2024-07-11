const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UserTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("threads endpoints", () => {
  afterAll(async () => {
    await pool.end();
  });

  beforeEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  //function to get access token
  const getAccessToken = async (server) => {
    const reg = await server.inject({
      method: "POST",
      url: "/users",
      payload: {
        username: "menzcreate",
        password: "secret",
        fullname: "Menz",
      },
    });

    const user = JSON.parse(reg.payload).data.addedUser;

    const response = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: {
        username: user.username,
        password: "secret",
      },
    });

    return JSON.parse(response.payload).data.accessToken;
  };

  it("should response 201 and added thread", async () => {
    const requestPayload = {
      title: "A thread",
      body: "A long thread",
    };
    const server = await createServer(container);
    const accessToken = await getAccessToken(server);

    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: requestPayload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    await expect(response.statusCode).toEqual(201);
    const responseJson = JSON.parse(response.payload);
    await expect(responseJson.data.addedThread.title).toEqual(
      requestPayload.title
    );
  });

  it("should respons 400 if payload not fullfilled", async () => {
    const payload = {
      title: "wew",
    };

    const server = await createServer(container);
    const accessToken = await getAccessToken(server);

    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: payload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual("fail");
    expect(responseJson.message).toEqual(
      "tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada"
    );
  });

  it("should response 400 if thread payload wrong data type", async () => {
    // Arrange
    const requestPayload = {
      title: 1234,
      body: "A long thread",
    };
    const server = await createServer(container);

    const accessToken = await getAccessToken(server);

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: requestPayload,
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Assert
    const responseJson = JSON.parse(response.payload);
    expect(response.statusCode).toEqual(400);
    expect(responseJson.status).toEqual("fail");
    expect(responseJson.message).toEqual(
      "tidak dapat membuat thread baru karena tipe data tidak sesuai"
    );
  });

  it("should response 401 if headers not contain access token", async () => {
    // Arrange
    const requestPayload = {
      title: "A thread",
      body: "A long thread",
    };
    const server = await createServer(container);

    // Action
    const response = await server.inject({
      method: "POST",
      url: "/threads",
      payload: requestPayload,
    });

    // Assert
    await expect(response.statusCode).toEqual(401);
  });
});
