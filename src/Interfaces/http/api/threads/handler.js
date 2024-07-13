const CommentUseCase = require("../../../../Applications/use_case/CommentUseCase");
const ThreadUseCase = require("../../../../Applications/use_case/ThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadsHandler = this.postThreadsHandler.bind(this);
    this.commentThreadHandler = this.commentThreadHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postThreadsHandler(request, h) {
    const threadUseCase = await this._container.getInstance(ThreadUseCase.name);
    const addedThread = await threadUseCase.addThread(
      request.auth.credentials.userId,
      request.payload
    );
    console.log(request.auth.credentials.userId);

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async commentThreadHandler(request, h) {
    const commentUseCase = await this._container.getInstance(
      CommentUseCase.name
    );
    const payload = {
      ...request.payload,
      threadId: request.params.threadId,
      parentId: request.params.commentId ?? null,
    };

    const addedComment = await commentUseCase.addComment(
      request.auth.credentials.userId,
      payload
    );

    const response = h.response({
      status: "success",
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const commentUseCase = await this._container.getInstance(
      CommentUseCase.name
    );
    await commentUseCase.deleteComment(
      request.auth.credentials.userId,
      request.params.threadId,
      request.params.commentId
    );

    const response = h.response({
      status: "success",
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
