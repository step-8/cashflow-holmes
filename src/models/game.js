const { shuffle } = require('../utils/shuffle.js');
const { Player } = require('./player.js');

const getNextAttrib = (players, type, attribs) => {
  const playersAttribs = players.map(player => player.details[type]);
  return attribs.find(attrib => !playersAttribs.includes(attrib));
};

const GameStatus = {
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
  #deck;
  #isGameStarted; // This need to removed afterwards and to be included in status.
  #status;
  #diceValue;
  constructor(colors, professions) {
    this.#gameID = null;
    this.#isGameStarted = false;
    this.#colors = shuffle(colors);
    this.#professions = shuffle(professions);
    this.#maxPlayers = 6;
    this.#players = [];
    this.#deck = {};
    this.#status = GameStatus.waiting;
    this.#diceValue = null;
  }

  rollDice() {
    this.#diceValue = Math.ceil(Math.random() * 6);
  }

  start() {
    this.#isGameStarted = true;
  }

  cancel() {
    this.#status = GameStatus.cancelled;
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
      status: this.#status,
      isGameStarted: this.#isGameStarted,
      gameID: this.#gameID,
      players: this.allPlayerDetails,
      diceValue: this.#diceValue
    };
  }
}

module.exports = { Game };
