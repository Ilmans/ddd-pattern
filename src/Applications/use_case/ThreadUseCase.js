const Comment = require("../../Domains/comments/entities/Comment");
const NewThread = require("../../Domains/threads/entities/NewThread");
const Thread = require("../../Domains/threads/entities/Thread");

class ThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async addThread(userId, newThread) {
    const { title, body } = new NewThread(newThread);

    const addedThread = await this._threadRepository.create(userId, {
      title,
      body,
    });

    return addedThread;
  }

  async getThreadById(threadId) {
   
    const thread = await this._threadRepository.find(threadId);
    const comments = await this._commentRepository.get(threadId);

    thread.comments = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._commentRepository.getChildComments(
          comment.id
        );
        return new Comment({
          ...comment,
          replies:
            replies.length > 0
              ? replies.map((reply) => new Comment(reply))
              : [],
        });
      })
    );

    return new Thread(thread);
  }
}

module.exports = ThreadUseCase;
