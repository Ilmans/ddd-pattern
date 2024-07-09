const ClientError = require("../ClientError");

describe("ClientError", () => {
  it("should throw error when directly called", () => {
    expect(() => new ClientError("client error")).toThrowError(
      "Cannot instantiate abstract class"
    );
  });
});
