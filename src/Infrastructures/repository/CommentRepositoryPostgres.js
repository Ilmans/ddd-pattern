const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../Domains/comments/CommentRepository");
const AddedComments = require("../../Domains/comments/entities/AddedComments");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async create(userId, data) {
    const { content, threadId, parentId } = data;
    const id = `comment-${this._idGenerator()}`;
    const query = {
      text: "INSERT INTO comments (id, user_id, parent_id, thread_id, body) VALUES ($1, $2, $3, $4, $5) RETURNING id, body, user_id",
      values: [id, userId, parentId ?? null, threadId, content],
    };
    const result = await this._pool.query(query);
    const row = result.rows[0];
    //rename user_id to userId
    row.userId = row.user_id;
    return new AddedComments(result.rows[0]);
  }

  async find(commentId) {
    const query = {
      text: "SELECT comments.*, users.id AS user_id, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.id = $1",
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("comment not found");
    }
    return result.rows[0];
  }

  async get(threadId) {
    const query = {
      text: "SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.thread_id = $1 ORDER BY comments.created_at ASC",
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async getChildComments(parentId) {
    const query = {
      text: "SELECT comments.*, users.username FROM comments JOIN users ON comments.user_id = users.id WHERE comments.parent_id = $1 ORDER BY comments.created_at ASC",
      values: [parentId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async delete(commentId, parent_id = null) {
    const q = parent_id ? "AND parent_id = $2" : "";
    const query = {
      text: `UPDATE comments SET deleted_at = NOW() WHERE id = $1 ${q} RETURNING id`,
      values: parent_id ? [commentId, parent_id] : [commentId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new Error("comment not found");
    }
  }
}

module.exports = CommentRepositoryPostgres;
