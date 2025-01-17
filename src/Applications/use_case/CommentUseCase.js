const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class CommentUseCase {
  constructor({ commentRepository, threadRepository, userRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._userRepository = userRepository;
  }
  // add comment or replies, if parent id is null, it comment.
  async addComment(userId, payload) {
    this._verifyContent(payload);

    const { content, threadId, parentId } = payload;
    await this._threadRepository.isExistThread(threadId);
    //todo: check if parent comment exist
    if (parentId) await this._commentRepository.find(parentId);
    return await this._commentRepository.create(userId, {
      content,
      threadId,
      parentId: parentId ?? null,
    });
  }

  async deleteComment(userId, threadId, commentId, parentId = null) {
    const comment = await this._commentRepository.find(commentId);

    if (comment.thread_id !== threadId)
      throw new NotFoundError("comment not found ");
    if (comment.user_id !== userId)
      throw new Error("COMMENT_USE_CASE.NOT_THE_COMMENT_OWNER");

    if (parentId) {
      const parentComment = await this._commentRepository.find(parentId);
      if (parentComment.parent_id !== null)
        throw new Error("COMMENT_USE_CASE.CANNOT_DELETE_REPLY");
    }

    await this._commentRepository.delete(commentId, parentId);
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
