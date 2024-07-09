const RegisterUser = require("../../RegisterUser");

describe("a RegisterUser entities", () => {
  it("should throw error when payload not contain needed property", () => {
    const payload = {
      username: "aaa",
      password: "secret",
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      "REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should error if payload not meet data type specification", () => {
    const payload = {
      username: 123,
      password: true,
      fullname: "me",
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      "REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when username more than 50 character", () => {
    const payload = {
      username: "dicodingindonesiadicodingindonesiadicodingindonesia",
      password: "secret",
      fullname: "me",
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      "REGISTER_USER.USERNAME_LIMIT_CHAR"
    );
  });

  it("should throw error when username contain restricted character", () => {
    const payload = {
      username: "dico ding",
      password: "secret",
      fullname: "me",
    };

    expect(() => new RegisterUser(payload)).toThrowError(
      "REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER"
    );
  });

  it("should create registerUser object correctly", () => {
    const payload = {
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    };

    const { username, password, fullname } = new RegisterUser(payload);
  });
});
