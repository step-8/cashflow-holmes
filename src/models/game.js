const { shuffle } = require('../utils/shuffle.js');
const { Player } = require('./player.js');
const deck = require('../../data/cards.json');
const { RatRace } = require('./ratRace.js');
const { Turn } = require('./turn.js');
const { Log } = require('./log.js');
const { toWords } = require('../utils/camelCaseToWords.js');

const getNextAttrib = (players, type, attribs) => {
  const playersAttribs = players.map(player => player.details[type]);
  return attribs.find(attrib => !playersAttribs.includes(attrib));
};

const randomDiceValue = () => Math.ceil(Math.random() * 6);

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
  #diceValues;
  #currentPlayerIndex;
  #ratRace;
  #currentCard;
  #currentTurn;
  #log;

  constructor(colors, professions) {
    this.#gameID = null;
    this.#colors = shuffle(colors);
    this.#professions = shuffle(professions);
    this.#maxPlayers = 6;
    this.#players = [];
    this.#status = gameStatus.waiting;
    this.#currentPlayerIndex = null;
    this.#diceValues = [1, 1];
    this.#ratRace = new RatRace(deck);
    this.#currentCard = null;
    this.#log = new Log();
    this.#currentTurn = new Turn(this.#currentCard, null, this.#log);
  }

  rollDice(dice) {
    this.#diceValues = [randomDiceValue(), randomDiceValue()];
    const currentPlayer = this.#players[this.#currentPlayerIndex];
    const dualDiceCount = currentPlayer.details.dualDiceCount;

    let totalCount = this.#diceValues[0];
    if (+dice === 2) {
      totalCount += this.#diceValues[1];
    }

    if (dualDiceCount > 0) {
      currentPlayer.dualDiceCount = dualDiceCount - 1;
    }

    currentPlayer.rolledDice = true;
    this.#moveCurrentPlayer(totalCount);
    this.#log.addLog(
      {
        username: currentPlayer.details.username,
        color: currentPlayer.details.color
      },
      `rolled ${totalCount}`);
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
    const currentPlayer = this.#players[this.#currentPlayerIndex];
    this.#currentTurn.updateCard(card);

    const username = currentPlayer.details.username;
    const color = currentPlayer.details.color;

    const cards = ['smallDeal', 'bigDeal'];
    if (cards.includes(card.cardName)) {
      this.#log.addLog({ username, color }, `chose ${toWords(card.cardName)}`);
      return;
    }
    this.#log.addLog({ username, color }, `landed on ${toWords(card.family)}`);
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
      diceValues: this.#diceValues,
      currentCard: this.#currentCard,
      ratRace: this.#ratRace,
      currentTurn: this.#currentTurn,
      transaction: this.#currentTurn.info.transaction,
      isTurnEnded: this.#currentTurn.info.state,
      logs: this.#log.getAllLogs()
    };
  }
}

module.exports = { Game };
