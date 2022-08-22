const { shuffle } = require('../utils/shuffle.js');
const { Game } = require('./game.js');

class Games {
  #colors;
  #professions;
  #games;
  #latestGameID;
  constructor(colors, professions) {
    this.#colors = colors;
    this.#professions = professions;
    this.#latestGameID = 0;
    this.#games = {};
  }

  get latestGameID() {
    return this.#latestGameID;
  }

  newGame(host) {
    this.#latestGameID++;
    const game = new Game(shuffle(this.#colors), shuffle(this.#professions));
    game.assignHost(host);
    game.assignGameID(this.#latestGameID);
    this.#games[this.#latestGameID] = game;
  }

  endGame(gameID) {
    delete this.#games[gameID];
  }

  getGame(gameID) {
    return this.#games[gameID];
  }
}

module.exports = { Games };
