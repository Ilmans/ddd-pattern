const InvariantError = require("../../Commons/exceptions/InvariantError");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthenticationRepository = require("../../Domains/authentication/AuthenticationRepository");

class AuthenticationRepositoryPostgres extends AuthenticationRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addToken(token) {
    const query = {
      text: "INSERT INTO authentications VALUES($1)",
      values: [token],
    };
    await this._pool.query(query);
  }

  async verifyToken(token) {
    const query = {
      text: "SELECT token FROM authentications WHERE token = $1",
      values: [token],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("token not found");
    }
  }

  async deleteToken(token) {
    const query = {
      text: "DELETE FROM authentications WHERE token = $1",
      values: [token],
    };
    await this._pool.query(query);
  }
}

module.exports = AuthenticationRepositoryPostgres;
