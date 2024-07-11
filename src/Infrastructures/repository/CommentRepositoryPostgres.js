const CommentRepository = require("../../Domains/comments/CommentRepository");

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
      text: "INSERT INTO comments (id,user_id,parent_id,thread_id,body) VALUES($1, $2, $3, $4, $5)",
      values: [id, userId, parentId, threadId ?? null, content],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }
}

module.exports = CommentRepositoryPostgres;
