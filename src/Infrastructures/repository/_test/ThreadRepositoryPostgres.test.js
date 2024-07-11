const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NewThread = require("../../../Domains/threads/entities/NewThread");
describe("ThredRepositoryPostgres", () => {
  beforeEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
    beforeEach(async () => {
      await UsersTableTestHelper.addUser({
        id: "user-12345",
        username: "menzcreate2",
      });
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
      await threadRepositoryPostgres.addThread("user-12345", newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadById("thread-123");
      await expect(threads).toHaveLength(1);
    });
  });

  //   describe("getThreadById function", () => {
  //     beforeEach(async () => {
  //       await UsersTableTestHelper.addUser({
  //         id: "user-123452",
  //         username: "menzcreate2",
  //       });
  //     });

  //     it("should return thread detail", async () => {
  //       // Arrange
  //       const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
  //       await ThreadsTableTestHelper.addThread({
  //         id: "thread-1234",
  //         userId: "user-123452",
  //       });

  //       // Action
  //       const thread = await threadRepositoryPostgres.getThreadById(
  //         "thread-1234"
  //       );

  //       // Assert
  //       await expect(thread.id).toEqual("thread-1234");
  //       //  expect(thread.title).toEqual("A thread");
  //     });
  //   });
});
