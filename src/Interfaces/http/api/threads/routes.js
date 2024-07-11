const routes = (handler) => [
  {
    method: "POST",
    path: "/threads",
    handler: handler.postThreadsHandler,
    options: {
      auth: "jwt",
    },
  },
];

module.exports = routes;
