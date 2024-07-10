const UserLogin = require("../UserLogin");
describe("user login entity", () => {
  it("should create user login entity correctly", () => {
    // Arrange
    const userLogin = {
      username: "menzcreate",
      password: "secret",
    };

    // Action
    const userLoginEntity = new UserLogin(userLogin);

    // Assert
    expect(userLoginEntity).toEqual({
      username: "menzcreate",
      password: "secret",
    });
  });

  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const userLogin = {
      username: "menzcreate",
    };

    // Action & Assert
    expect(() => new UserLogin(userLogin)).toThrowError(
      "USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const userLogin = {
      username: "menzcreate",
      password: true,
    };

    // Action & Assert
    expect(() => new UserLogin(userLogin)).toThrowError(
      "USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });
});
