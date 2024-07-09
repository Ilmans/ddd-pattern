const AddUserUseCase = require("../../../../Applications/use_case/AddUserUseCase");

class UsersHandler {
  constructor(container) {
    this._container = container;
    this.postUserHandler = this.postUserHandler.bind(this);
  }

  postUserHandler(request, h) {
    const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
    const addedUser = addUserUseCase.execute(request.payload);
    const response = h.response({
      status: "success",
      data: {
        addedUser,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UsersHandler;
