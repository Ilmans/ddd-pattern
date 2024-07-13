class Comment {
  constructor({ id, username, content, created_at, deleted_at }) {
    this.id = id;
    this.username = username;
    this.content = deleted_at ? "**komentar telah dihapus**" : content;
    this.date = created_at;
  }
}

module.exports = Comment;
