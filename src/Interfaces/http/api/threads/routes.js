const routes = (handler) => [
  {
    method: "GET",
    path: "/threads/{threadId}",
    handler: handler.getThreadByIdHandler,
  },
  {
    method: "POST",
    path: "/threads",
    handler: handler.postThreadsHandler,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    handler: handler.commentThreadHandler,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "POST",
    path: "/threads/{threadId}/comments/{commentId}/replies",
    handler: handler.replyCommentHandler,
    options: {
      auth: "jwt",
    },
  },

  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}",
    handler: handler.deleteCommentHandler,
    options: {
      auth: "jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}/replies/{replyId}",
    handler: handler.deleteReplyCommentHandler,
    options: {
      auth: "jwt",
    },
  },
];

module.exports = routes;
