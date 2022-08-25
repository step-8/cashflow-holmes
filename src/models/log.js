class Log {
  #logs;

  constructor() {
    this.#logs = [];
  }

  init(logs) {
    this.#logs = logs;
  }

  addLog(player, message) {
    const username = player.username;
    const color = player.color;
    this.#logs.push({ username, color, message });
  }

  getAllLogs() {
    return this.#logs;
  }
}

module.exports = { Log };
