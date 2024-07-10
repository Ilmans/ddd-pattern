const AuthUseCase = require("../../../../Applications/use_case/AuthUseCase");

class AuthHandler {
  constructor(container) {
    this._container = container;

    this.postAuthHandler = this.postAuthHandler.bind(this);
  }

  async postAuthHandler(request, h) {
    const authUseCase = this._container.getInstance(AuthUseCase.name);
    const { accessToken, refreshToken } = await authUseCase.doLogin(
      request.payload
    );
    const response = h.response({
      status: "success",
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }
}
module.exports = AuthHandler;
