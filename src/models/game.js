const { Player } = require('./player.js');
const deck = require('../../data/cards.json');
const { RatRace } = require('./ratRace.js');
const { Turn } = require('./turn.js');
const { Log } = require('./log.js');
const { toWords } = require('../utils/commonLib.js');
const { Profile } = require('./profile.js');

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

  getCard(action) {
    let type = this.#getCardType();

    if (action) {
      type = action + 'Deal';
    }

    this.currentCard = this.#ratRace.getCard(type);
    return this.#currentCard;
  }

  setNotifications() {
    const type = this.#getCardType();
    this.#notifications = this.#ratRace.getNotifications(type, this.currentPlayer.details);
  }

  #addPlayer(username, role) {
    if (this.#isUserAlreadyJoined(username)) {
      return;
    }

    const color = getNextAttrib(this.#players, 'color', this.#colors);
    const profession = getNextAttrib(this.#players, 'profession', this.#professions);
    const profile = new Profile(profession);
    profile.setDefaults();
    const player = new Player(username, role, color, profession, profile);
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

  #getDiceValues() {
    // return [randomDiceValue(), randomDiceValue()];
    return [1, randomDiceValue()];
  }

  reRollDice() {
    this.#diceValues = this.#getDiceValues();
    const diceValue = this.#diceValues[0];
    const currentPlayer = this.currentPlayer;

    this.addLog(currentPlayer, `rolled ${diceValue}`);
    this.#currentTurn.lottery(diceValue, this.#currentCard);
    currentPlayer.changeDiceStatus(true);
  }

  rollDice(diceCount) {
    this.#diceValues = this.#getDiceValues();
    const currentPlayer = this.currentPlayer;
    const dualDiceCount = currentPlayer.dualDiceCount;
    const totalCount = this.#calculateTotalSteps(diceCount);

    if (dualDiceCount > 0) {
      currentPlayer.decrementDualDiceCount();
    }

    currentPlayer.changeDiceStatus(true);
    this.#moveCurrentPlayer(totalCount);
    this.addLog(currentPlayer, `rolled ${totalCount}`);
  }

  resetDice() {
    const currentPlayer = this.currentPlayer;
    currentPlayer.changeDiceStatus(false);
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
    this.#currentTurn.setTurnCompleted(false);
    this.#currentCard = null;
    this.#notifications = [];

    if (this.currentPlayer.skippedTurns > 0) {
      this.currentPlayer.decrementSkippedTurns();
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

  addNotification(notification) {
    this.#notifications.push(notification);
  }

  removeTopNotification() {
    this.#notifications = this.#notifications.slice(1);
  }

  removeNotifier() {
    if (!this.#currentCard || !this.#currentCard.notifications) {
      return;
    }
    this.#currentCard.notifications.shift();
  }

  payday() {
    return this.#currentTurn.payday();
  }

  doodad() {
    this.#currentTurn.doodad();
    return this.#currentTurn.canPlayerContinue();
  }

  charity() {
    return this.#currentTurn.charity();
  }

  baby() {
    return this.#currentTurn.baby();
  }

  downsized() {
    return this.#currentTurn.downsized();
  }

  buyRealEstate() {
    return this.#currentTurn.buyRealEstate();
  }

  buyStocks(count) {
    return this.#currentTurn.buyStocks(count);
  }

  buyLottery() {
    return this.#currentTurn.buyLottery();
  }

  sellStocks(username, count) {
    const player = this.getPlayer(username);
    let status = 2;
    if (player.sellStocks(this.#currentCard, count)) {
      status = 3;
      this.#log.addLog(player, `sold ${count} ${this.#currentCard.symbol} stocks`);
      return this.#currentTurn.setTransactionState('deal', status);
    }
    this.#currentTurn.setTransactionState('deal', status);

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

  get notifications() {
    return this.#notifications;
  }

  getPlayer(username) {
    return this.#players.find(player => player.details.username === username);
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
