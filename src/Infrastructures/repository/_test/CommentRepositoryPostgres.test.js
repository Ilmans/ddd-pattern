const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UserTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddedComments = require("../../../Domains/comments/entities/AddedComments");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe("CommentRepositoryPostgres", () => {
  beforeEach(async () => {
    await UserTableTestHelper.delete("user-123");
    await CommentsTableTestHelper.deleteComment("comment-123");
    await ThreadsTableTestHelper.delete("thread-123");
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("find comment function", () => {
    it("should throw NotFoundError when comment not available", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      // Action & Assert
      await expect(
        commentRepositoryPostgres.find("comment-123")
      ).rejects.toThrowError("comment not found");
    });

    it("should return comment correctly", async () => {
      // Arrange
      const userId = "user-123";
      const threadId = "thread-123";
      const commentId = "comment-123";
      const commentContent = "A comment";

      await UserTableTestHelper.addUser({ id: userId });
      await ThreadsTableTestHelper.addThread({
        id: threadId,
        userId,
        title: "title",
        body: "body",
      });

      await CommentsTableTestHelper.addComment({
        id: commentId,
        owner: userId,
        thread_id: threadId,
        body: commentContent,
      });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.find(commentId);

      // Assert
      expect(comment.id).toBe(commentId);
      expect(comment.body).toBe(commentContent);
      expect(comment.user_id).toBe(userId);
    });
  });

  //   describe("verifyCommentOwner function", () => {
  //     it("should throw AuthorizationError when comment owner not authorized", async () => {
  //       // Arrange
  //       const userId = "user-123";
  //       const threadId = "thread-123";
  //       const commentId = "comment-123";

  //       await UsersTableTestHelper.addUser({ id: userId });
  //       await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
  //       await CommentsTableTestHelper.addComment({
  //         id: commentId,
  //         thread: threadId,
  //         owner: userId,
  //       });

  //       const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

  //       // Action & Assert
  //       await expect(
  //         commentRepositoryPostgres.verifyCommentOwner(commentId, "user-other")
  //       ).rejects.toThrowError(AuthorizationError);
  //     });

  //     it("should not throw AuthorizationError when comment owner authorized", async () => {
  //       // Arrange
  //       const userId = "user-123";
  //       const threadId = "thread-123";
  //       const commentId = "comment-123";

  //       await UsersTableTestHelper.addUser({ id: userId });
  //       await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
  //       await CommentsTableTestHelper.addComment({
  //         id: commentId,
  //         thread: threadId,
  //         owner: userId,
  //       });

  //       const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

  //       // Action & Assert
  //       await expect(
  //         commentRepositoryPostgres.verifyCommentOwner(commentId, userId)
  //       ).resolves.not.toThrowError(AuthorizationError);
  //     });
  //   });

  describe("addComment function", () => {
    beforeEach(async () => {
      await UserTableTestHelper.addUser({ id: "user-123", username: "random" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        userId: "user-123",
      });
    });

    it("should persist new comment", async () => {
      // Arrange
      const newComment = {
        content: "A comment",
      };

      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.create("user-123", {
        content: newComment.content,
        threadId: "thread-123",
      });

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById(
        "comment-123"
      );
      expect(comments).toHaveLength(1);
    });

    it("should return added comment correctly", async () => {
      // Arrange

      const fakeIdGenerator = () => "123";
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const addedComment = await commentRepositoryPostgres.create("user-123", {
        content: "A comment",
        threadId: "thread-123",
      });
      console.log(addedComment);
      // Assert
      expect(addedComment).toStrictEqual(
        new AddedComments({
          id: "comment-123",
          body: "A comment",
          userId: "user-123",
        })
      );
    });
  });

  //   describe("getCommentsByThreadId function", () => {
  //     it("should return thread comments correctly", async () => {
  //       // Arrange
  //       const userId = "user-123";
  //       const otherUserId = "user-456";
  //       const threadId = "thread-123";

  //       await UsersTableTestHelper.addUser({ id: userId, username: "foobar" });
  //       await UsersTableTestHelper.addUser({
  //         id: otherUserId,
  //         username: "johndoe",
  //       });
  //       await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });

  //       await CommentsTableTestHelper.addComment({
  //         id: "comment-new",
  //         content: "A new comment",
  //         date: "2023-09-10",
  //         thread: threadId,
  //         owner: userId,
  //       });
  //       await CommentsTableTestHelper.addComment({
  //         id: "comment-old",
  //         content: "An old comment",
  //         date: "2023-09-09",
  //         thread: threadId,
  //         owner: otherUserId,
  //       });

  //       const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

  //       // Action
  //       const comments = await commentRepositoryPostgres.getCommentsByThreadId(
  //         threadId
  //       );

  //       // Assert
  //       expect(comments).toHaveLength(2);
  //       expect(comments[0].id).toBe("comment-old"); // older comment first
  //       expect(comments[1].id).toBe("comment-new");
  //       expect(comments[0].username).toBe("johndoe");
  //       expect(comments[1].username).toBe("foobar");
  //       expect(comments[0].content).toBe("An old comment");
  //       expect(comments[1].content).toBe("A new comment");
  //       expect(comments[0].date).toBeTruthy();
  //       expect(comments[1].date).toBeTruthy();
  //     });
  //   });

  //   describe("deleteCommentById function", () => {
  //     it("should soft delete comment and update deleted_at field", async () => {
  //       // Arrange
  //       await UsersTableTestHelper.addUser({ id: "user-123" });
  //       await ThreadsTableTestHelper.addThread({
  //         id: "thread-123",
  //         owner: "user-123",
  //       });

  //       const commentId = "comment-123";
  //       const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

  //       await CommentsTableTestHelper.addComment({
  //         id: commentId,
  //         thread: "thread-123",
  //         owner: "user-123",
  //       });

  //       // Action
  //       await commentRepositoryPostgres.deleteCommentById(commentId);

  //       // Assert
  //       const comments = await CommentsTableTestHelper.findCommentsById(
  //         commentId
  //       );
  //       expect(comments).toHaveLength(1);
  //       expect(comments[0].deleted_at).toBeTruthy();
  //     });
  //   });
});
