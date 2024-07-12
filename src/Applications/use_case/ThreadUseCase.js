const NewThread = require("../../Domains/threads/entities/NewThread");

class ThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async addThread(userId, newThread) {
    const { title, body } = new NewThread(newThread);

    const addedThread = await this._threadRepository.create(userId, {
      title,
      body,
    });
    console.log(newThread);
    return addedThread;
  }
}

module.exports = ThreadUseCase;
