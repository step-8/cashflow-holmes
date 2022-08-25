const deck = require('../../data/cards.json');
const { RatRace } = require('./ratRace.js');
const { Turn } = require('./turn.js');
const { Log } = require('./log.js');
const { toWords } = require('../utils/commonLib.js');

class Game {
  #gameID;
  #players;
  #status;
  #diceValues;
  #currentPlayerIndex;
  #ratRace;
  #currentCard;
  #currentPlayer;
  #currentTurn;
  #notifications;
  #log;
  #dice;

  constructor(gameID, players, dice) {
    this.#gameID = gameID;
    this.#players = players;
    this.#status = 'started';
    this.#currentPlayerIndex = 0;
    this.#currentPlayer = players[0];
    this.#dice = dice;
    this.#diceValues = this.#dice.face();
    this.#ratRace = new RatRace(deck);
    this.#log = new Log();
    this.#notifications = [];
    this.#currentTurn = new Turn(this.#currentCard, this.#currentPlayer, this.#log);
  }

  #getCardType() {
    const currentPosition = this.currentPlayer.currentPosition;
    return this.#ratRace.getCardType(currentPosition);
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

  activateReroll() {
    this.#currentTurn.activateReroll();
  }

  reRollDice() {
    this.#diceValues = this.#dice.roll(1);
    const diceValue = this.#diceValues[0];
    const currentPlayer = this.currentPlayer;

    this.addLog(currentPlayer, `rolled ${diceValue}`);
    this.#currentTurn.lottery(this.#players, diceValue);
    currentPlayer.changeDiceStatus(true);
  }

  rollDice(diceCount) {
    this.#diceValues = this.#dice.roll(diceCount);
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
    this.currentPlayer.changeDiceStatus(false);
  }

  changeTurn() {
    ++this.#currentPlayerIndex;
    this.#currentPlayerIndex = this.#currentPlayerIndex % this.#players.length;
    this.#currentTurn.updatePlayer(this.currentPlayer);
    this.resetDice();
    this.#currentTurn.setTurnCompleted(false);
    this.#currentCard = null;
    this.#notifications = [];

    if (this.currentPlayer.isInFastTrack) {
      this.changeTurn();
      return;
    }

    if (this.currentPlayer.skippedTurns > 0) {
      this.currentPlayer.decrementSkippedTurns();
      this.addLog(this.currentPlayer, 'skipped turn');
      this.changeTurn();
    }
  }

  #moveCurrentPlayer(steps) {
    this.currentPlayer.move(steps);
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

  buyGoldCoins() {
    return this.#currentTurn.buyGoldCoins();
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

  propertyDamage() {
    return this.#currentTurn.propertyDamage();
  }

  skip() {
    this.#currentTurn.skip();
  }

  getPlayer(username) {
    return this.#players.find(player => player.details.username === username);
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

  get currentPlayer() {
    return this.#players[this.#currentPlayerIndex];
  }

  get currentPlayerName() {
    return this.currentPlayer.username;
  }

  get isRolledDice() {
    return this.currentPlayer.isRolledDice;
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
