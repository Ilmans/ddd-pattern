class AuthenticationRepository {
  addToken(token) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  verifyToken(token) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }

  deleteToken(token) {
    throw new Error("ERR_METHOD_NOT_IMPLEMENTED");
  }
}

module.exports = AuthenticationRepository;
