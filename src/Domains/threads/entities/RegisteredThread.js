class RegisteredThread {
  constructor({ id, user_id, title, body, created_at }) {
    this.id = id;
    this.owner = user_id;
    this.title = title;
    this.body = body;
    this.createdAt = created_at;
  }
}

module.exports = RegisteredThread;
