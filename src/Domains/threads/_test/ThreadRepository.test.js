const ThreadRepository = require("../ThreadRepository");

describe("ThreadRepository", () => {
  it("should throw error when call abstract behavior", async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    await expect(threadRepository.create("user-123", {})).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(threadRepository.find("thread-123")).rejects.toThrowError(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
