const { shuffle } = require('../utils/shuffle.js');
const { Player } = require('./player.js');
const deck = require('../../data/cards.json');
const { RatRace } = require('./ratRace.js');
const { Turn } = require('./turn.js');

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
  #ratRace;
  #currentCard;
  #currentTurn;

  constructor(colors, professions) {
    this.#gameID = null;
    this.#colors = shuffle(colors);
    this.#professions = shuffle(professions);
    this.#maxPlayers = 6;
    this.#players = [];
    this.#status = gameStatus.waiting;
    this.#currentPlayerIndex = null;
    this.#diceValue = 1;
    this.#ratRace = new RatRace(deck);
    this.#currentCard = null;
    this.#currentTurn = new Turn(this.#currentCard, null);
  }

  rollDice() {
    // this.#diceValue = Math.ceil(Math.random() * 6);
    this.#diceValue = 2;
    const currentPlayer = this.#players[this.#currentPlayerIndex];
    currentPlayer.rolledDice = true;
    this.#moveCurrentPlayer(this.#diceValue);
  }

  resetDice() {
    const currentPlayer = this.#players[this.#currentPlayerIndex];
    currentPlayer.rolledDice = false;
  }

  start() {
    this.#status = gameStatus.started;
    this.#currentPlayerIndex = 0;
    const currentPlayer = this.#players[this.#currentPlayerIndex];
    this.#currentTurn.updatePlayer(currentPlayer);
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

    player.createProfile();
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
    this.#currentPlayerIndex = this.#currentPlayerIndex % this.#players.length;
    const currentPlayer = this.#players[this.#currentPlayerIndex];
    this.#currentTurn.updatePlayer(currentPlayer);
    this.resetDice();
    this.turnCompleted = false;
    this.#currentCard = null;
  }

  #moveCurrentPlayer(steps) {
    this.#players[this.#currentPlayerIndex].move(steps);
  }

  isValidGameID(gameID) {
    return this.#gameID === gameID;
  }

  isLobbyFull() {
    return this.#maxPlayers === this.#players.length;
  }

  set currentCard(card) {
    this.#currentCard = card;
    this.#currentTurn.updateCard(card);
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

  set turnCompleted(status) {
    this.#currentTurn.turnComplete = status;
  }

  get state() {
    return {
      currentPlayer: this.currentPlayer,
      status: this.#status,
      gameID: this.#gameID,
      players: this.allPlayerDetails,
      diceValue: this.#diceValue,
      currentCard: this.#currentCard,
      ratRace: this.#ratRace,
      currentTurn: this.#currentTurn,
      isTurnEnded: this.#currentTurn.info.state
    };
  }
}

module.exports = { Game };
