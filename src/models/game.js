const { shuffle } = require('../utils/shuffle.js');
const { Player } = require('./player.js');

const getNextAttrib = (players, type, attribs) => {
  const playersAttribs = players.map(player => player.details[type]);
  return attribs.find(attrib => !playersAttribs.includes(attrib));
};

const gameStatus = {
  started: 'started',
  cancelled: 'cancelled',
  waiting: 'waiting',
  progress: 'inProgress'
};

class Game {
  #gameID;
  #colors;
  #professions;
  #players;
  #maxPlayers;
  #status;
  #diceValue;
  #currentPlayerIndex;
  #deck;
  constructor(colors, professions) {
    this.#gameID = null;
    this.#colors = shuffle(colors);
    this.#professions = shuffle(professions);
    this.#maxPlayers = 6;
    this.#players = [];
    this.#status = gameStatus.waiting;
    this.#currentPlayerIndex = null;
    this.#deck = {};
    this.#diceValue = null;
  }

  rollDice() {
    this.#diceValue = Math.ceil(Math.random() * 6);
  }

  start() {
    this.#status = gameStatus.started;
    this.#currentPlayerIndex=0;
  }

  cancel() {
    this.#status = gameStatus.cancelled;
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
    player.assignColor(
      getNextAttrib(this.#players, 'color', this.#colors)
    );
    player.assignProfession(
      getNextAttrib(this.#players, 'profession', this.#professions)
    );

    this.#players.push(player);
  }

  removePlayer(username) {
    const playerIndex = this.#getPlayerIndex(username);
    if (playerIndex <= -1) {
      return;
    }
    this.#players.splice(playerIndex, 1);
  }

  changeTurn() {
    ++this.#currentPlayerIndex;
    this.#currentPlayerIndex= this.#currentPlayerIndex % this.#players.length;
  }

  isValidGameID(gameID) {
    return this.#gameID === gameID;
  }

  isLobbyFull() {
    return this.#maxPlayers === this.#players.length;
  }

  get currentPlayer() {
    if (this.#currentPlayerIndex === null) {
      return null;
    }
    return this.#players[this.#currentPlayerIndex].details;
  }

  get allPlayerDetails() {
    return this.#players.map(player => player.details);
  }

  get state() {
    const currentPlayer = this.currentPlayer;
    return {
      currentPlayer,
      status: this.#status,
      gameID: this.#gameID,
      players: this.allPlayerDetails,
      diceValue: this.#diceValue
    };
  }
}

module.exports = { Game };
