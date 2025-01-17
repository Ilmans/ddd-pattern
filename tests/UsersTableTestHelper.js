//addUser
//findUserById

const pool = require("../src/Infrastructures/database/postgres/pool");

//cleanTable
const UserTableTestHelper = {
  async addUser({
    id = "user-123",
    username = "menzcreate",
    password = "secret",
    fullname = "Dicoding Indonesia",
  }) {
    const query = {
      text: "INSERT INTO users VALUES($1, $2, $3, $4)",
      values: [id, username, password, fullname],
    };

    await pool.query(query);
    return { id, username, password, fullname };
  },

  async findUsersById(id) {
    const query = {
      text: "SELECT * FROM users WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM users WHERE 1=1");
  },

  async delete(id) {
    const query = {
      text: "DELETE FROM users WHERE id = $1",
      values: [id],
    };

    await pool.query(query);
  },
};

module.exports = UserTableTestHelper;
