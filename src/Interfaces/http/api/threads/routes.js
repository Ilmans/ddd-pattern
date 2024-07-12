const routes = (handler) => [
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
];

module.exports = routes;
