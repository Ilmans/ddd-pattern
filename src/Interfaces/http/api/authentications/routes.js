const routes = (handler) => [
  {
    method: "POST",
    path: "/authentications",
    handler: handler.postAuthHandler,
  },
  {
    method: "PUT",
    path: "/authentications",
    handler: handler.putAuthHandler,
  },
];

module.exports = routes;
