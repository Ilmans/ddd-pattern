const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const RegisteredThread = require("../../Domains/threads/entities/RegisteredThread");

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async create(userId, newThread) {
    const { title, body } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4) RETURNING id, user_id, title, body",
      values: [id, userId, title, body],
    };

    const result = await this._pool.query(query);

    return new RegisteredThread(result.rows[0]);
  }

  async isExistThread(threadId) {
    const query = {
      text: "SELECT id FROM threads WHERE id = $1",
      values: [threadId],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError("thread not found");
    }
  }

  async find(id) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };
    const result = await this._pool.query(query);
    if (result.rows.length === 0) {
      throw new NotFoundError("thread not found");
    }
    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;
