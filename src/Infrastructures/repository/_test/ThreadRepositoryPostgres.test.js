const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const RegisteredThread = require("../../../Domains/threads/entities/RegisteredThread");

describe("ThreadRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("isexists function", () => {
    it("should throw NotFoundError when thread not available", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.isExistThread("thread-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when thread available", async () => {
      // Arrange
      const userId = "user-12367";
      const threadId = "thread-123";

      await UsersTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.isExistThread(threadId)
      ).resolves.not.toThrowError(NotFoundError);
    });
  });

  describe("create thread function", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
    });

    it("should persist new thread", async () => {
      // Arrange
      const newThread = new NewThread({
        title: "A thread",
        body: "A long thread",
      });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.create("user-123", newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById("thread-123");
      expect(threads).toHaveLength(1);
    });

    it("should return added thread correctly", async () => {
      // Arrange
      const newThread = new NewThread({
        title: "A thread",
        body: "A long thread",
      });

      const fakeIdGenerator = () => "123";
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedThread = await threadRepositoryPostgres.create(
        "user-12388",
        newThread
      );

      // Assert
      expect(addedThread).toStrictEqual(
        new RegisteredThread({
          id: "thread-123",
          title: "A thread",
          user_id: "user-12388",
        })
      );
    });
  });

  describe("find thread function", () => {
    it("should throw NotFoundError when thread not found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(
        threadRepositoryPostgres.find("thread-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should return thread correctly", async () => {
      // Arrange
      const userId = "user-123";
      const threadId = "thread-123";
      const date = new Date().toISOString();

      await UsersTableTestHelper.addUser({ id: userId, username: "foobar" });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        title: "A thread",
        body: "A long thread",

        userId: userId,
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const thread = await threadRepositoryPostgres.find(threadId);

      // Assert
      expect(thread.id).toStrictEqual(threadId);
      expect(thread.title).toStrictEqual("A thread");
      expect(thread.body).toStrictEqual("A long thread");
      expect(thread.created_at).toBeTruthy();
      expect(thread.username).toStrictEqual("foobar");
    });
  });
});
