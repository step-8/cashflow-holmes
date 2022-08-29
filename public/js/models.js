class Log {
  #logs;

  constructor() {
    this.#logs = [];
  }

  mergeLogs(logs) {
    const unLoggedLogsLength = logs.length - this.#logs.length;

    if (unLoggedLogsLength <= 0) {
      return [];
    }
    this.#logs = logs;
    return logs.slice(-unLoggedLogsLength);
  }
}

class GameState {
  #log;
  #bankruptedPlayers;
  constructor(log) {
    this.#log = log;
    this.#bankruptedPlayers = [];
  }

  mergeLogs(logs) {
    return this.#log.mergeLogs(logs);
  }

  mergeBankruptedPlayers(players) {
    const unMergedPlayers = players.length - this.#bankruptedPlayers.length;

    if (unMergedPlayers <= 0) {
      return [];
    }
    this.#bankruptedPlayers = players;
    return this.#bankruptedPlayers.slice(-unMergedPlayers);
  }
}
