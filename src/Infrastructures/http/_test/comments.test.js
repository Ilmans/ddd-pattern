const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UserTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe("/threads/{threadId}/comments endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UserTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  const getAccessToken = async (
    server,
    payload = {
      username: "foobarro",
      password: "secreto",
      fullname: "Foo Baraa",
    }
  ) => {
    // add user
    await server.inject({
      method: "POST",
      url: "/users",
      payload,
    });

    // get access token
    const response = await server.inject({
      method: "POST",
      url: "/authentications",
      payload: {
        username: payload.username,
        password: payload.password,
      },
    });

    return JSON.parse(response.payload).data.accessToken;
  };

  describe("when POST /threads/{threadId}/comments", () => {
    it("should response 201 and added comment", async () => {
      // Arrange
      const requestPayload = { content: "A comment" };
      const server = await createServer(container);

      const accessToken = await getAccessToken(server);

      // add thread
      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "A thread",
          body: "A long thread",
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { id: threadId } = JSON.parse(threadResponse.payload).data
        .addedThread;

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      // const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      //   expect(responseJson.status).toEqual("success");
      //   expect(responseJson.data.addedComment).toBeDefined();
      //   expect(responseJson.data.addedComment.content).toEqual(
      //     requestPayload.content
      //   );
    });

    // it("should response 400 if payload not contain needed property", async () => {
    //   // Arrange
    //   const server = await createServer(container);

    //   const accessToken = await getAccessToken(server);

    //   // add thread
    //   const threadResponse = await server.inject({
    //     method: "POST",
    //     url: "/threads",
    //     payload: {
    //       title: "A thread",
    //       body: "A long thread",
    //     },
    //     headers: { Authorization: `Bearer ${accessToken}` },
    //   });
    //   const { id: threadId } = JSON.parse(threadResponse.payload).data
    //     .addedThread;

    //   // Action
    //   const response = await server.inject({
    //     method: "POST",
    //     url: `/threads/${threadId}/comments`,
    //     payload: {},
    //     headers: { Authorization: `Bearer ${accessToken}` },
    //   });

    //   // Assert
    //   const responseJson = JSON.parse(response.payload);
    //   expect(response.statusCode).toEqual(400);
    //   expect(responseJson.status).toEqual("fail");
    //   expect(responseJson.message).toEqual(
    //     "tidak dapat membuat komentar baru karena properti yang dibutuhkan tidak ada"
    //   );
    // });

    // it("should response 400 if payload wrong data type", async () => {
    //   // Arrange
    //   const requestPayload = { content: 1234 };
    //   const server = await createServer(container);

    //   const accessToken = await getAccessToken(server);

    //   // add thread
    //   const threadResponse = await server.inject({
    //     method: "POST",
    //     url: "/threads",
    //     payload: {
    //       title: "A thread",
    //       body: "A long thread",
    //     },
    //     headers: { Authorization: `Bearer ${accessToken}` },
    //   });
    //   const { id: threadId } = JSON.parse(threadResponse.payload).data
    //     .addedThread;

    //   // Action
    //   const response = await server.inject({
    //     method: "POST",
    //     url: `/threads/${threadId}/comments`,
    //     payload: requestPayload,
    //     headers: { Authorization: `Bearer ${accessToken}` },
    //   });

    //   // Assert
    //   const responseJson = JSON.parse(response.payload);
    //   expect(response.statusCode).toEqual(400);
    //   expect(responseJson.status).toEqual("fail");
    //   expect(responseJson.message).toEqual("komentar harus berupa string");
    // });

    // it("should response 404 if thread is not exist", async () => {
    //   // Arrange
    //   const requestPayload = { content: "A comment" };
    //   const server = await createServer(container);

    //   const accessToken = await getAccessToken(server);

    //   // Action
    //   const response = await server.inject({
    //     method: "POST",
    //     url: "/threads/thread-567/comments",
    //     payload: requestPayload,
    //     headers: { Authorization: `Bearer ${accessToken}` },
    //   });

    //   // Assert
    //   const responseJson = JSON.parse(response.payload);
    //   expect(response.statusCode).toEqual(404);
    //   expect(responseJson.status).toEqual("fail");
    //   expect(responseJson.message).toEqual("thread tidak ditemukan");
    // });

    // it("should response 401 if headers not contain access token", async () => {
    //   // Arrange
    //   const requestPayload = { content: "A comment" };
    //   const server = await createServer(container);

    //   const accessToken = await getAccessToken(server);

    //   // add thread
    //   const threadResponse = await server.inject({
    //     method: "POST",
    //     url: "/threads",
    //     payload: {
    //       title: "A thread",
    //       body: "A long thread",
    //     },
    //     headers: { Authorization: `Bearer ${accessToken}` },
    //   });
    //   const { id: threadId } = JSON.parse(threadResponse.payload).data
    //     .addedThread;

    //   // Action
    //   const response = await server.inject({
    //     method: "POST",
    //     url: `/threads/${threadId}/comments`,
    //     payload: requestPayload,
    //   });

    //   // Assert
    //   expect(response.statusCode).toEqual(401);
    // });
  });

  describe("when POST /threads/{threadId}/comments/{commentId}/replies", () => {
    it("should response 201 and added reply", async () => {
      // Arrange
      const requestPayload = { content: "A reply" };
      const server = await createServer(container);

      const accessToken = await getAccessToken(server);

      // add thread
      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "A thread",
          body: "A long thread",
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { id: threadId } = JSON.parse(threadResponse.payload).data
        .addedThread;

      // add comment
      const commentResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: {
          content: "A comment",
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { id: commentId } = JSON.parse(commentResponse.payload).data
        .addedComment;

      // Action
      const response = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      expect(response.statusCode).toEqual(201);
    });

    // it("should response 400 if payload not contain needed property", async () => {
    //   // Arrange
    //   const server = await createServer(container);

    //   const accessToken = await getAccessToken(server);

    //   // add thread
    //   const threadResponse = await server.inject({
    //     method: "POST",
    //     url: "/threads",
    //     payload: {
    //       title: "A thread",
    //       body: "A long thread",
    //     },
    //     headers: { Authorization: `Bearer ${accessToken}` },
    //   });
    //   const { id: threadId } = JSON.parse(threadResponse.payload).data
    //     .addedThread;

    //   // add comment
    //   const commentResponse = await server.inject({
    //     method: "POST",
    //     url: `/threads/${threadId}/comments`,
    //     payload: {
    //       content: "A comment",
    //     },
    //     headers
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}", () => {
    it("should response 201 ", async () => {
      // Arrange
      const server = await createServer(container);

      const accessToken = await getAccessToken(server, {
        username: "foobar2",
        password: "secreto",
        fullname: "Foo Baraa",
      });

      // add thread
      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "A thread",
          body: "A long thread",
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { id: threadId } = JSON.parse(threadResponse.payload).data
        .addedThread;

      // add comment
      const commentResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: {
          content: "A comment",
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { id: commentId } = JSON.parse(commentResponse.payload).data
        .addedComment;

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      expect(response.statusCode).toEqual(201);
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}", () => {
    it("should response 201", async () => {
      // Arrange
      const server = await createServer(container);

      const accessToken = await getAccessToken(server, {
        username: "foobar2",
        password: "secreto",
        fullname: "Foo Baraa",
      });

      // add thread
      const threadResponse = await server.inject({
        method: "POST",
        url: "/threads",
        payload: {
          title: "A thread",
          body: "A long thread",
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { id: threadId } = JSON.parse(threadResponse.payload).data
        .addedThread;

      // add comment

      const commentResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments`,
        payload: {
          content: "A comment",
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { id: commentId } = JSON.parse(commentResponse.payload).data
        .addedComment;

      // add reply

      const replyResponse = await server.inject({
        method: "POST",
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {
          content: "A reply",
        },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const { id: replyId } = JSON.parse(replyResponse.payload).data
        .addedComment;

      // Action

      const response = await server.inject({
        method: "DELETE",
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert

      expect(response.statusCode).toEqual(201);
    });
  });
});
