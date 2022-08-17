class Log {
  #logs;

  constructor() {
    this.#logs = [];
  }

  addLog(username, message) {
    this.#logs.push({ username, message });
  }

  getAllLogs() {
    return this.#logs;
  }
}

module.exports = { Log };
