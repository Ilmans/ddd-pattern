const AuthHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "authentications",
  register: async (server, { container }) => {
    const authHandler = new AuthHandler(container);
    server.route(routes(authHandler));
  },
};
