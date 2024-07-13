const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentUseCase = require("../CommentUseCase");

describe("CommentUseCase", () => {
  describe("addComment", () => {
    it("should orchestrating the addComment use case", async () => {
      const payload = {
        content: "new comment",
        threadId: "thread-123",
      };

      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      mockThreadRepository.isExistThread = jest.fn(() => Promise.resolve(true));
      mockCommentRepository.create = jest.fn(() =>
        Promise.resolve({ id: "comment-123" })
      );

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      const addedComment = await commentUseCase.addComment("user-123", payload);

      expect(addedComment).toStrictEqual({ id: "comment-123" });

      expect(mockThreadRepository.isExistThread).toBeCalledWith("thread-123");
    });

    it("should orchestrating the addComment use case with parent comment", async () => {
      const payload = {
        content: "new comment",
        threadId: "thread-123",
        parentId: "comment-123",
      };

      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      mockThreadRepository.isExistThread = jest.fn(() => Promise.resolve(true));
      mockCommentRepository.find = jest.fn(() =>
        Promise.resolve({
          id: "comment-123",
          thread_id: "thread-123",
          user_id: "user-123",
        })
      );
      mockCommentRepository.create = jest.fn(() =>
        Promise.resolve({ id: "comment-124" })
      );

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      const addedComment = await commentUseCase.addComment("user-123", payload);

      expect(addedComment).toStrictEqual({ id: "comment-124" });

      expect(mockThreadRepository.isExistThread).toBeCalledWith("thread-123");
      expect(mockCommentRepository.find).toBeCalledWith("comment-123");
    });

    it("should throw error if payload not contain needed property", async () => {
      const payload = {};

      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      await expect(
        commentUseCase.addComment("user-123", payload)
      ).rejects.toThrow("COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY");
    });

    it("should throw error if payload not meet data type specification", async () => {
      const payload = {
        content: 123,
      };

      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      await expect(
        commentUseCase.addComment("user-123", payload)
      ).rejects.toThrow("COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION");
    });

    it("should throw NotFoundError if thread not found", async () => {
      const payload = {
        content: "new comment",
        threadId: "thread-123",
      };

      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      mockThreadRepository.isExistThread = jest.fn(() => {
        throw new NotFoundError("Thread tidak ditemukan");
      });

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      await expect(
        commentUseCase.addComment("user-123", payload)
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe("deleteComment", () => {
    it("should orchestrating the deleteComment use case", async () => {
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      mockCommentRepository.find = jest.fn(() =>
        Promise.resolve({
          id: "comment-123",
          thread_id: "thread-123",
          user_id: "user-123",
        })
      );
      mockCommentRepository.delete = jest.fn(() => Promise.resolve());

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      await commentUseCase.deleteComment(
        "user-123",
        "thread-123",
        "comment-123"
      );

      expect(mockCommentRepository.find).toBeCalledWith("comment-123");
      expect(mockCommentRepository.delete).toBeCalledWith("comment-123", null);
    });

    it("should throw NotFoundError if comment not found", async () => {
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      mockCommentRepository.find = jest.fn(() => {
        throw new NotFoundError("Comment not found");
      });

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      await expect(
        commentUseCase.deleteComment("user-123", "thread-123", "comment-123")
      ).rejects.toThrowError(NotFoundError);
    });

    it("should throw error if user not the owner of the comment", async () => {
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      mockCommentRepository.find = jest.fn(() =>
        Promise.resolve({
          id: "comment-123",
          thread_id: "thread-123",
          user_id: "user-124",
          body: "comment body",
        })
      );

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      await expect(
        commentUseCase.deleteComment("user-123", "thread-123", "comment-123")
      ).rejects.toThrow("COMMENT_USE_CASE.NOT_THE_COMMENT_OWNER");
    });
  });

  describe("deleteComment (reply)", () => {
    it("should throw error if parent comment is a reply", async () => {
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      mockCommentRepository.find = jest.fn(() =>
        Promise.resolve({
          id: "comment-123",
          thread_id: "thread-123",
          user_id: "user-123",
          parent_id: "comment-122",
        })
      );

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      await expect(
        commentUseCase.deleteComment(
          "user-123",
          "thread-123",
          "comment-123",
          "comment-122"
        )
      ).rejects.toThrow("COMMENT_USE_CASE.CANNOT_DELETE_REPLY");
    });

    it("should delete reply comment", async () => {
      const mockCommentRepository = new CommentRepository();
      const mockThreadRepository = new ThreadRepository();

      mockCommentRepository.find = jest.fn().mockImplementation((id) => {
        if (id === "comment-123") {
          //reply comment
          return {
            id: "comment-123",
            thread_id: "thread-123",
            user_id: "user-123",
            parent_id: "comment-122",
          };
        }
        //parent comment
        return {
          id: "comment-122",
          thread_id: "thread-123",
          user_id: "user-123",
          parent_id: null,
        };
      });

      mockCommentRepository.delete = jest.fn(() => Promise.resolve());

      const commentUseCase = new CommentUseCase({
        commentRepository: mockCommentRepository,
        threadRepository: mockThreadRepository,
      });

      await commentUseCase.deleteComment(
        "user-123",
        "thread-123",
        "comment-123",
        "comment-122"
      );

      expect(mockCommentRepository.find).toBeCalledWith("comment-123");
      expect(mockCommentRepository.find).toBeCalledWith("comment-122");
      expect(mockCommentRepository.delete).toBeCalledWith(
        "comment-123",
        "comment-122"
      );
    });
  });
});
