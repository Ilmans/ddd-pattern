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
    mockThreadRepo.addThread = jest.fn(() =>
      Promise.resolve({
        id: "thread-123",
        title: newThread.title,
        owner: "user-123",
      })
    );

    const threadUseCase = new ThreadUseCase({
      threadRepository: mockThreadRepo,
    });

    // Action
    const addedThread = await threadUseCase.addThread("user-123", newThread);
    // Assert
    await expect(addedThread.id).toEqual("thread-123");
    await expect(mockThreadRepo.addThread).toBeCalledWith(
      "user-123",
      newThread
    );
  });
});
