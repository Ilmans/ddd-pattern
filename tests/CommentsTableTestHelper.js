/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const CommentsTableTestHelper = {
  async addComment({
    id = "comment-123",
    body = "A new comment",
    date = new Date().toISOString(),
    thread_id = "thread-123",
    owner = "user-123",
    deletedAt = null,
    parentId = null,
  }) {
    const query = {
      text: "INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6, $7)",
      values: [id, owner, parentId, thread_id, body, date, deletedAt],
    };

    await pool.query(query);
  },

  async findCommentsById(id) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM comments WHERE 1=1");
  },

  async deleteComment(id) {
    const query = {
      text: "DELETE FROM comments WHERE id = $1",
      values: [id],
    };

    await pool.query(query);
  },

  async getChildComments(parentId) {
    const query = {
      text: "SELECT * FROM comments WHERE parent_id = $1",
      values: [parentId],
    };

    const result = await pool.query(query);
    return result.rows;
  },
};

module.exports = CommentsTableTestHelper;
