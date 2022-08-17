class Log {
  #logs;

  constructor() {
    this.#logs = [];
  }

  addLog({ username, color }, message) {
    this.#logs.push({ username, color, message });
  }

  getAllLogs() {
    return this.#logs;
  }
}

module.exports = { Log };
