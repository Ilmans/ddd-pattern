const Comment = require("../../comments/entities/Comment");

class Thread {
  constructor({ id, title, body, created_at, username, comments = [] }) {
    // console.log("here", comments);
    this.id = id;
    this.title = title;
    this.body = body;
    this.date = created_at;
    this.username = username;
    this.comments = comments;
  }
}

module.exports = Thread;
