const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NewThread = require("../../../Domains/threads/entities/NewThread");
describe("ThredRepositoryPostgres", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
    });

    it("should  add thread", async () => {
      // Arrange
      const fakeIdGenerator = () => "123"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      const newThread = new NewThread({
        title: "A thread",
        body: "A long thread",
      });

      // Action
      await threadRepositoryPostgres.addThread("user-123", newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById("thread-123");
      expect(threads).toHaveLength(1);
    });
  });

  describe("getThreadById function", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({ id: "user-123" });
    });

    it("should return thread detail", async () => {
      const fakeIdGenerator = () => "thread-123";
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );
      await ThreadsTableTestHelper.addThread({ id: "thread-123" });

      // Action
      const thread = await threadRepositoryPostgres.getThreadById("thread-123");

      // Assert
      expect(thread.id).toEqual("thread-123");
      //  expect(thread.title).toEqual("A thread");
    });
  });
});
