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
    thread.comments = comments;
    return new Thread(thread);
  }
}

module.exports = ThreadUseCase;
