const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class CommentUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }

  async addComment(userId, payload) {
    this._verifyContent(payload);

    const { content, threadId, parentId } = payload;
    await this._threadRepository.isExistThread(threadId);
    //todo: check if parent comment exist
    return await this._commentRepository.create(userId, {
      content,
      threadId,
      parentId: parentId ?? null,
    });
  }

  // validate input from user
  _verifyContent(payload) {
    const { content } = payload;
    if (!content) {
      throw new Error("COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (typeof content !== "string") {
      throw new Error("COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CommentUseCase;
