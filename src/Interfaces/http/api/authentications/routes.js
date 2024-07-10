const routes = (handler) => [
  {
    method: "POST",
    path: "/authentications",
    handler: handler.postAuthHandler,
  },
];

module.exports = routes;
