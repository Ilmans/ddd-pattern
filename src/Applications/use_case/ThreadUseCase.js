const NewThread = require("../../Domains/threads/entities/NewThread");

class ThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }


  async addThread(userId, newThread) {
    const { title, body } = new NewThread(newThread);
    return this._threadRepository.addThread(userId, { title, body });
  }

  
}

module.exports = ThreadUseCase;
