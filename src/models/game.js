const { shuffle } = require('../utils/shuffle.js');
const { Player } = require('./player.js');

class Game {
  #gameID;
  #colors;
  #professions;
  #players;
  #maxPlayers;
  #deck;
  #isGameStarted;
  constructor(colors, professions) {
    this.#gameID = null;
    this.#isGameStarted = false;
    this.#colors = shuffle(colors);
    this.#professions = shuffle(professions);
    this.#maxPlayers = 6;
    this.#players = [];
    this.#deck = {};
  }

  start() {
    this.#isGameStarted = true;
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

  addPlayer(username, role) {
    if (this.#isUserAlreadyJoined(username)) {
      return;
    }

    const player = new Player(username, role);
    const playerIndex = this.#players.length;
    player.assignColor(this.#colors[playerIndex]);
    player.assignProfession(this.#professions[playerIndex]);
    this.#players.push(player);
  }

  removePlayer(username) {
    const playerIndex = this.#getPlayerIndex(username);
    if (playerIndex <= -1) {
      return;
    }
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
      isGameStarted: this.#isGameStarted,
      gameID: this.#gameID,
      players: this.allPlayerDetails
    };
  }
}

module.exports = { Game };
