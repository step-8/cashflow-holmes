const { Player } = require('./player.js');

class Game {
  #gameID;
  #colors;
  #professions;
  #players;
  #maxPlayers;
  #deck;
  constructor(colors, professions) {
    this.#gameID = null;
    this.#colors = colors;
    this.#professions = professions;
    this.#maxPlayers = 6;
    this.#players = [];
    this.#deck = {};
  }

  assignGameID(gameID) {
    this.#gameID = gameID;
  }

  #getPlayerIndex(username) {
    return this.#players.findIndex(player => player.details.username === username);
  }

  #isUserAlreadyJoined(username) {
    const playerStatus = this.#getPlayerIndex(username);
    return playerStatus > -1;
  }

  addPlayer(username) {
    if (this.#isUserAlreadyJoined(username)) {
      return;
    }

    const player = new Player(username);
    const playerIndex = this.#players.length;
    player.assignColor(this.#colors[playerIndex]);
    player.assignProfession(this.#professions[playerIndex]);
    this.#players.push(player);
  }

  removePlayer(username) {
    const playerIndex = this.#getPlayerIndex(username);
    this.#players.splice(playerIndex, 1);
  }

  isValidGameID(gameID) {
    return this.#gameID === gameID;
  }

  isLobbyFull() {
    return this.#maxPlayers === this.#players.length;
  }

  get allPlayerDetails() {
    return this.#players.map(player => player.details);
  }

  get state() {
    return {
      gameID: this.#gameID,
      players: this.allPlayerDetails
    };
  }
}

module.exports = { Game };
