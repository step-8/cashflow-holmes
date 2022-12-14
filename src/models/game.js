const deck = require('../../data/cards.json');
const { RatRace } = require('./ratRace.js');
const { Turn } = require('./turn.js');
const { Log } = require('./log.js');
const { camelToCapitalize, toWords } = require('../utils/commonLib.js');
const { Player } = require('./player');
const { Response, createResponses } = require('./response');

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
  #bankruptedPlayers;

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
    this.#bankruptedPlayers = [];
    this.#currentTurn = new Turn(
      this.#currentCard, this.#currentPlayer, this.#log,
      new Response(createResponses(players)));
  }

  init({ currentPlayerIndex, gameID, players, currentCard, logs }) {
    this.#currentPlayerIndex = currentPlayerIndex;
    this.#gameID = gameID;
    this.#players = players.map((details) => {
      const { username, role, color, profile } = details;
      const player = new Player(username, role, color, profile);
      player.init(details);
      return player;
    });
    this.#currentCard = currentCard;
    this.#log = new Log();
    this.#log.init(logs);
  }

  findPlayer(username) {
    return this.#players.find(player => player.username === username);
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

  setNotifications(username) {
    const type = this.#getCardType();
    this.#notifications = this.#ratRace.getNotifications(type, this.currentPlayer.details, username);
  }

  #calculateTotalSteps(diceCount) {
    let totalCount = this.#diceValues[0];
    if (diceCount === 2) {
      totalCount += this.#diceValues[1];
    }
    return totalCount;
  }

  addLog(username, message) {
    this.#log.addLog(this.findPlayer(username), message);
  }

  activateReroll() {
    this.#currentTurn.activateReroll();
  }

  reRollDice(username) {
    this.#diceValues = this.#dice.roll(1);
    const diceValue = this.#diceValues[0];
    const currentPlayer = this.currentPlayer;

    this.addLog(username, `rolled ${diceValue} again`);
    this.#currentTurn.lottery(this.#players, currentPlayer, diceValue);
    currentPlayer.changeDiceStatus(true);
  }

  nextPlayer() {
    ++this.#currentPlayerIndex;
    this.#currentPlayerIndex = this.#currentPlayerIndex % this.#players.length;
    return this.currentPlayer;
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
    this.addLog(currentPlayer.username, `rolled ${totalCount}`);
  }

  resetDice() {
    this.currentPlayer.changeDiceStatus(false);
  }

  changeTurn() {
    const responses = new Response(createResponses(this.#players));
    const currentPlayer = this.nextPlayer();

    const { isInFastTrack, hasBankrupt } = currentPlayer.details;
    if (isInFastTrack || hasBankrupt) {
      this.changeTurn();
      return;
    }

    this.#currentTurn = new Turn(null, currentPlayer, this.#log, responses);
    this.resetDice();
    this.#currentCard = null;
    this.#notifications = [];

    if (this.currentPlayer.skippedTurns > 0) {
      this.addLog(this.currentPlayer.username, 'skipped turn');
      this.currentPlayer.decrementSkippedTurns();
      if (this.currentPlayer.dualDiceCount > 0) {
        this.currentPlayer.decrementDualDiceCount();
      }
      this.changeTurn();
      return;
    }
  }

  #moveCurrentPlayer(steps) {
    this.currentPlayer.move(steps);
  }

  addNotification(notification) {
    this.#notifications.push(notification);
  }

  removeTopNotification() {
    this.#notifications.shift();
  }

  removeNotifier() {
    if (!this.#currentCard || !this.#currentCard.notifications) {
      return;
    }
    this.#currentCard.notifications.shift();
  }

  buyGoldCoins(username) {
    return this.#currentTurn.buyGoldCoins(this.findPlayer(username));
  }

  payday(username) {
    const player = this.findPlayer(username);
    if (player.details.hasMlm) {
      const [diceValue] = this.#dice.roll(1);
      return this.#currentTurn.paydayWithMlm(this.findPlayer(username), diceValue);
    }
    return this.#currentTurn.payday(this.findPlayer(username));
  }

  doodad(username) {
    this.#currentTurn.doodad(this.findPlayer(username));
    return this.#currentTurn.canPlayerContinue();
  }

  charity(username) {
    return this.#currentTurn.charity(this.findPlayer(username));
  }

  baby(username) {
    return this.#currentTurn.baby(this.findPlayer(username));
  }

  downsized(username) {
    return this.#currentTurn.downsized(this.findPlayer(username));
  }

  buyRealEstate(username) {
    return this.#currentTurn.buyRealEstate(this.findPlayer(username));
  }

  buyStocks(username, count) {
    return this.#currentTurn.buyStocks(this.findPlayer(username), count);
  }

  buyLottery(username) {
    return this.#currentTurn.buyLottery(this.findPlayer(username));
  }

  buyMlmDeal(username) {
    return this.#currentTurn.buyMlm(this.findPlayer(username));
  }

  sellGoldCoins(username, count) {
    const player = this.findPlayer(username);
    let status = 4;

    if (player.sellGold(this.#currentCard, count)) {
      status = 5;
      this.#currentTurn.sellGold(player, count);
    }

    this.#currentTurn.setTransactionState('market', status, username);
  }

  sellStocks(username, count) {
    const player = this.findPlayer(username);
    let status = 2;

    if (player.sellStocks(this.#currentCard, count)) {
      status = 3;
      this.#currentTurn.sellStocks(player, count);
      this.#currentTurn.setTransactionState('deal', status, username);
      return;
    }

    this.#currentTurn.setTransactionState('deal', status, username);
  }

  sellRealEstate(username, id) {
    const player = this.findPlayer(username);
    let status = 8;

    if (player.sellRealEstate(this.#currentCard, id)) {
      status = 7;
      this.#currentTurn.sellRealEstate(player, id);
      this.#currentTurn.setTransactionState('market', status, username);
      return;
    }

    this.#currentTurn.setTransactionState('market', status, username);
  }

  propertyDamage(username) {
    return this.#currentTurn.propertyDamage(this.findPlayer(username));
  }

  skip(username) {
    this.#currentTurn.skip(this.findPlayer(username));
  }

  takeLoan(username, amount) {
    const player = this.findPlayer(username);
    const status = player.takeLoan(amount);
    const message = `took loan of $${amount}`;
    this.addLog(username, message);
    return status;
  }

  payLoan(username, amount, type) {
    const player = this.findPlayer(username);
    let status = 0;

    if (player.payLoan(amount, type)) {
      status = 1;
      const message = `paid ${camelToCapitalize(type)} of $${amount}`;
      this.addLog(username, message);
    }

    return status;
  }

  sellAllAssets(username) {
    const player = this.findPlayer(username);
    player.sellAllAssets();

    let message = 'sold all assets';
    this.addLog(username, message);

    if (player.isBankrupt()) {
      this.#bankruptedPlayers.push(player.details);
      message = 'has bankrupted';
      this.addLog(username, message);
      this.changeTurn();
    }

    return !player.isBankrupt();
  }

  set currentCard(card) {
    this.#currentCard = card;

    this.#currentTurn.updateCard(card);

    const cards = ['smallDeal', 'bigDeal'];
    const username = this.currentPlayer.username;
    if (cards.includes(card.name)) {
      this.addLog(username, `chose ${toWords(card.name)}`);
      return;
    }
    this.addLog(username, `landed on ${toWords(card.family)}`);
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
      currentPlayerIndex: this.#currentPlayerIndex,
      status: this.#status,
      gameID: this.#gameID,
      players: this.allPlayerDetails,
      diceValues: this.#diceValues,
      currentCard: this.#currentCard,
      ratRace: this.#ratRace,
      currentTurn: this.#currentTurn,
      transaction: this.#currentTurn.info.transaction,
      isTurnEnded: this.#currentTurn.info.state,
      turnResponses: this.#currentTurn.responses,
      notifications: this.#notifications,
      logs: this.#log.getAllLogs(),
      bankruptedPlayers: this.#bankruptedPlayers
    };
  }
}

module.exports = { Game };
