const CommentRepository = require("../../../Domains/comments/CommentRepository");
const Comment = require("../../../Domains/comments/entities/Comment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const NewThread = require("../../../Domains/threads/entities/NewThread");
const ThreadUseCase = require("../ThreadUseCase");

describe("Thread Use case", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange

    const newThread = new NewThread({
      title: "A Thread",
      body: "A long thread",
    });

    const mockThreadRepo = new ThreadRepository();
    mockThreadRepo.create = jest.fn(() =>
      Promise.resolve({
        id: "thread-123",
        title: newThread.title,
        owner: "user-123",
      })
    );

    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: {},
    });

    // Action
    const addedThread = await threadUseCase.addThread("user-123", newThread);
    // Assert
    await expect(addedThread.id).toEqual("thread-123");
    await expect(mockThreadRepo.create).toBeCalledWith("user-123", newThread);
  });

  it("should orchestrating the get thread by id action correctly", async () => {
    // Arrange
    const mockThreadRepo = new ThreadRepository();
    mockThreadRepo.find = jest.fn(() =>
      Promise.resolve({
        id: "thread-123",
        title: "A Thread",
        body: "A long thread",
        user_id: "user-123",
        created_at: "2021-08-08T07:22:33.555Z",
        username: "mnzcreate",
      })
    );
    const mockComment = {
      id: "comment-123",
      username: "johndoe",
      date: "2023-09-08T07:22:33.555Z",
      content: "a comment",
    };
    const mockCommentRepo = new CommentRepository();
    mockCommentRepo.get = jest.fn(() => Promise.resolve([mockComment]));

    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepo,
      commentRepository: mockCommentRepo,
    });

    // Action
    // const thread = await mockThreadRepo.find("thread-123");
    // const comments = await mockCommentRepo.get("thread-123");
    // thread.comments = comments.map((comment) => new Comment(comment));

    const threaddetail = await threadUseCase.getThreadById("thread-123");

    // Assert
    await expect(threaddetail.id).toEqual("thread-123");
    await expect(threaddetail.comments).toEqual([new Comment(mockComment)]);
    await expect(mockThreadRepo.find).toBeCalledWith("thread-123");
    await expect(mockCommentRepo.get).toBeCalledWith("thread-123");
  });
});
