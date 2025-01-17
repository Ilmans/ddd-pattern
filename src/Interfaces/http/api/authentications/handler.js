const AuthUseCase = require("../../../../Applications/use_case/AuthUseCase");

class AuthHandler {
  constructor(container) {
    this._container = container;

    this.postAuthHandler = this.postAuthHandler.bind(this);
    this.putAuthHandler = this.putAuthHandler.bind(this);
    this.deleteAuthHandler = this.deleteAuthHandler.bind(this);
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

  async putAuthHandler(request, h) {
    const authUseCase = this._container.getInstance(AuthUseCase.name);
    const newAccessToken = await authUseCase.renewRefreshToken(request.payload);
    const response = h.response({
      status: "success",
      data: {
        accessToken: newAccessToken,
      },
    });
    response.code(200);
    return response;
  }

  async deleteAuthHandler(request, h) {
    const authUseCase = this._container.getInstance(AuthUseCase.name);
    await authUseCase.logout(request.payload);

    const response = h.response({
      status: "success",
    });

    return response;
  }
}

module.exports = AuthHandler;
