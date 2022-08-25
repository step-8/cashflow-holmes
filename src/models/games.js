const { shuffle } = require('../utils/shuffle.js');
const { Lobby } = require('./lobby.js');

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

  newLobby(host, dice) {
    this.#latestGameID++;
    const lobby = new Lobby(this.#latestGameID,
      shuffle(this.#colors), shuffle(this.#professions), dice);
    lobby.assignHost(host);
    this.#games[this.#latestGameID] = lobby;
  }

  startGame(gameID) {
    this.#games[gameID] = this.getGame(gameID).start();
  }

  endGame(gameID) {
    delete this.#games[gameID];
  }

  getGame(gameID) {
    return this.#games[gameID];
  }

  get latestGameID() {
    return this.#latestGameID;
  }
}

module.exports = { Games };
