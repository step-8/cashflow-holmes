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
  #notifications;
  #log;

  constructor(gameID, colors, professions) {
    this.#gameID = gameID;
    this.#colors = colors;
    this.#professions = professions;
    this.#maxPlayers = 6;
    this.#players = [];
    this.#status = gameStatus.waiting;
    this.#currentPlayerIndex = null;
    this.#diceValues = [1, 1];
    this.#ratRace = new RatRace(deck);
    this.#log = new Log();
    this.#notifications = [];
    this.#currentTurn = new Turn(this.#currentCard, null, this.#log);
  }

  get currentPlayer() {
    return this.#players[this.#currentPlayerIndex];
  }

  #isUserAlreadyJoined(username) {
    const playerStatus = this.#getPlayerIndex(username);
    return playerStatus > -1;
  }
  get currentPlayerName() {
    return this.currentPlayer.username;
  }

  get isRolledDice() {
    return this.currentPlayer.isRolledDice;
  }

  #getCardType() {
    const currentPosition = this.currentPlayer.currentPosition;
    const type = this.#ratRace.getCardType(currentPosition);
    return type;
  }

  getCard() {
    const type = this.#getCardType();
    this.currentCard = this.#ratRace.getCard(type);
    return this.#currentCard;
  }

  setNotifications() {
    const type = this.#getCardType();
    this.notifications = this.#ratRace.getNotifications(type, this.currentPlayer.details);
  }

  #addPlayer(username, role) {
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

  assignHost(username) {
    this.#addPlayer(username, 'host');
  }

  addGuest(username) {
    this.#addPlayer(username, 'guest');
  }

  #calculateTotalSteps(diceCount) {
    let totalCount = this.#diceValues[0];
    if (diceCount === 2) {
      totalCount += this.#diceValues[1];
    }
    return totalCount;
  }

  addLog(player, message) {
    this.#log.addLog(player, message);
  }

  rollDice(diceCount) {
    this.#diceValues = [randomDiceValue(), randomDiceValue()];
    const currentPlayer = this.currentPlayer;
    const dualDiceCount = currentPlayer.dualDiceCount;
    const totalCount = this.#calculateTotalSteps(diceCount);

    if (dualDiceCount > 0) {
      currentPlayer.dualDiceCount = dualDiceCount - 1;
    }

    currentPlayer.rolledDice = true;
    this.#moveCurrentPlayer(totalCount);
    this.addLog(currentPlayer, `rolled ${totalCount}`);
  }

  resetDice() {
    const currentPlayer = this.currentPlayer;
    currentPlayer.rolledDice = false;
  }

  start() {
    this.#status = gameStatus.started;
    this.#currentPlayerIndex = 0;
    const currentPlayer = this.currentPlayer;
    this.#currentTurn.updatePlayer(currentPlayer);
  }

  cancel() {
    this.#status = gameStatus.cancelled;
  }

  #getPlayerIndex(username) {
    return this.#players.findIndex(player => player.details.username === username);
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
    this.#currentTurn.updatePlayer(this.currentPlayer);
    this.resetDice();
    this.turnCompleted = false;
    this.#currentCard = null;
    this.#notifications = [];

    if (this.currentPlayer.skippedTurns > 0) {
      this.currentPlayer.skippedTurns--;
      this.addLog(this.currentPlayer, 'skipped turn');
      this.changeTurn();
    }
  }

  #moveCurrentPlayer(steps) {
    this.currentPlayer.move(steps);
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

    const cards = ['smallDeal', 'bigDeal'];
    if (cards.includes(card.cardName)) {
      this.addLog(this.currentPlayer, `chose ${toWords(card.cardName)}`);
      return;
    }
    this.addLog(this.currentPlayer, `landed on ${toWords(card.family)}`);
  }

  get notifications() {
    return this.#notifications;
  }

  set notifications(notifications) {
    this.#notifications = notifications;
  }

  removeNotifier() {
    if (!this.#currentCard || !this.#currentCard.notifications) {
      return;
    }
    this.#currentCard.notifications.shift();
  }

  payday() {
    this.#currentTurn.payday();
  }

  doodad() {
    this.#currentTurn.doodad();
    return this.#currentTurn.canPlayerContinue();
  }

  charity() {
    this.#currentTurn.charity();
  }

  baby() {
    this.#currentTurn.baby();
  }

  downsized() {
    this.#currentTurn.downsized();
  }

  buyRealEstate() {
    this.#currentTurn.buyRealEstate();
  }

  buyStocks(count) {
    this.#currentTurn.buyStocks(count);
  }

  sellStocks(count) {
    this.#currentTurn.sellStocks(count);
  }

  skip() {
    this.#currentTurn.skip();
  }

  get currentPlayerDetails() {
    if (this.#currentPlayerIndex === null) {
      return null;
    }
    return this.currentPlayer.details;
  }

  get allPlayerDetails() {
    return this.#players.map(player => player.details);
  }

  getPlayer(username) {
    return this.#players.find(player => player.details.username === username);
  }

  set turnCompleted(status) {
    this.#currentTurn.turnComplete = status;
  }

  get currentTurn() {
    return this.#currentTurn;
  }

  get state() {
    return {
      currentPlayer: this.currentPlayerDetails,
      status: this.#status,
      gameID: this.#gameID,
      players: this.allPlayerDetails,
      diceValues: this.#diceValues,
      currentCard: this.#currentCard,
      ratRace: this.#ratRace,
      currentTurn: this.#currentTurn,
      transaction: this.#currentTurn.info.transaction,
      isTurnEnded: this.#currentTurn.info.state,
      notifications: this.#notifications,
      logs: this.#log.getAllLogs()
    };
  }
}

module.exports = { Game };
