class Comment {
  constructor({ id, username, content, created_at, deleted_at, replies = [] }) {
    this.id = id;
    this.username = username;
    this.content = deleted_at ? "**komentar telah dihapus**" : content;
    this.date = created_at;
    this.replies = replies;
  }
}

module.exports = Comment;
