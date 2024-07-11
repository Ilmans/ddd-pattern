const Boom = require("@hapi/boom");

const authMiddleware = (AuthTokenManager) => {
  return async (req, h) => {
    try {
      const { authorization } = req.headers;
      const accessToken = authorization.replace("Bearer ", "");

      const credential = await AuthTokenManager.verifyAccessToken(accessToken);

      return h.authenticated({
        credentials: { userId: credential.id, username: credential.username },
      });
    } catch (error) {
      return Boom.unauthorized("Anda tidak mempunyai akses ke sini");
    }
  };
};

module.exports = authMiddleware;
