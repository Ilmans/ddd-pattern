const AuthenticationError = require("../AuthenticationError");

describe("authenticationError", () => {
  it("should create an error correctly", () => {
    const authenticationError = new AuthenticationError("authentication error");

    expect(authenticationError.statusCode).toEqual(401);
    expect(authenticationError.message).toEqual("authentication error");
    expect(authenticationError.name).toEqual("AuthenticationError");
  });
});
