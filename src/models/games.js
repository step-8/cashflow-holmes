const { Game } = require('./game.js');

class Games {
  #colors;
  #professions;
  #games;
  constructor(colors, professions) {
    this.#colors = colors;
    this.#professions = professions;
    this.#games = {};
  }

  newGame(gameID) {
    const game = new Game(this.#colors, this.#professions);
    game.assignGameID(gameID);
    this.#games[gameID] = game;
  }

  endGame(gameID) {
    delete this.#games[gameID];
  }

  getGame(gameID) {
    return this.#games[gameID];
  }

  getGameByUsername(username) {
    for (const gameID in this.#games) {
      const game = this.#games[gameID];
      const allPlayers = game.allPlayersDetails;

      const player = allPlayers.find(player => player.username === username);
      if (player) {
        return game;
      }
    }
  }

  isValidGameKey(gameID) {
    if (this.#games[gameID]) {
      return true;
    }
    return false;
  }
}

module.exports = { Games };
