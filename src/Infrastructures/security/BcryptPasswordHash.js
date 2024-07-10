const PasswordHash = require("../../Applications/security/PasswordHash");
const AuthenticationError = require("../../Commons/exceptions/AuthenticationError");

class BcryptPasswordHash extends PasswordHash {
  constructor(bcrypt, saltRound = 10) {
    super();
    this._bcrypt = bcrypt;
    this._saltRound = saltRound;
  }

  async hash(password) {
    return this._bcrypt.hash(password, this._saltRound);
  }

  async compare(password, hashedPassword) {
    if (!this._bcrypt.compare(password, hashedPassword)) {
      throw new AuthenticationError("Bad credentials");
    }
  }
}

module.exports = BcryptPasswordHash;
