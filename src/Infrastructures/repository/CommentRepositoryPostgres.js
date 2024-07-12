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
    return new AddedComments(result.rows[0]);
  }
}

module.exports = CommentRepositoryPostgres;
