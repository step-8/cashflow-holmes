class Turn {
  #card;
  #currentPlayer;
  #turnCompleted;
  #log;
  #currentTransaction;
  #response;

  constructor(card, currentPlayer, log, response) {
    this.#card = card;
    this.#currentPlayer = currentPlayer;
    this.#response = response;
    this.#log = log;
  }

  respond(responder) {
    const username = this.#currentPlayer.username;
    this.#response.responded = responder || username;
  }

  #playerInfo() {
    const username = this.#currentPlayer.username;
    const color = this.#currentPlayer.color;
    return { username, color };
  }

  #cashflow() {
    return this.#currentPlayer.details.profile.cashFlow;
  }

  activateReroll() {
    this.#currentPlayer.allowReroll();
  }

  resetTransaction() {
    this.#currentTransaction = null;
  }

  setTransactionState(family, status) {
    this.#currentTransaction = { family, status };
  }

  #changeTurnIfNoCard(username) {
    if (this.#card.id) {
      return;
    }
    this.respond();
  }

  payday() {
    const username = this.#currentPlayer.username;
    this.#currentPlayer.payday();
    this.#log.addLog(this.#playerInfo(), `received pay of $${this.#cashflow()}`);

    this.setTransactionState('payday', 1);
    this.#changeTurnIfNoCard(username);
    return true;
  }

  doodad() {
    const cost = this.#card.cost;
    const status = this.#currentPlayer.doodad(cost);
    this.setTransactionState('doodad', status);
    if (!status) {
      return;
    }

    this.#log.addLog(this.#playerInfo(), `payed $${cost} on ${this.#card.heading}`);
    this.respond();
  }

  buyLottery() {
    const { cost, type } = this.#card;
    const status = this.#currentPlayer.buyLottery(cost);
    this.setTransactionState('deal', status);
    if (!status) {
      return;
    }

    this.#log.addLog(this.#playerInfo(), `bought ${type} for $${cost}`);
  }

  buyRealEstate() {
    const status = this.#currentPlayer.buyRealEstate(this.#card);
    this.setTransactionState('deal', status);
    if (!status) {
      return;
    }
    this.#log.addLog(this.#playerInfo(), `bought ${this.#card.symbol}`);
    this.respond();
  }

  buyStocks(username, count) {
    const status = this.#currentPlayer.buyStocks(this.#card, count);
    this.setTransactionState('deal', status);
    if (!status) {
      return;
    }
    this.#log.addLog(this.#playerInfo(), `bought ${count} ${this.#card.symbol} stocks`);
    this.respond(username);
  }

  buyGoldCoins() {
    const status = this.#currentPlayer.addGoldCoins(this.#card);
    this.setTransactionState('deal', status);
    this.#log.addLog(this.#playerInfo(), `bought ${this.#card.count} gold coins`);
    this.respond();
  }

  charity() {
    const amount = 0.1 * this.#currentPlayer.details.profile.totalIncome;
    const status = this.#currentPlayer.charity();
    this.setTransactionState('charity', status);
    if (!status) {
      return;
    }

    this.#currentPlayer.initializeDualDiceCount();
    this.#log.addLog(this.#playerInfo(), `donated $${amount} to charity`);
    this.respond();
  }

  downsized() {
    const amount = this.#currentPlayer.details.profile.totalExpenses;
    const status = this.#currentPlayer.downsized();
    this.setTransactionState('downsized', status);

    if (!status) {
      return;
    }

    this.#currentPlayer.initializeSkippedTurns();
    this.#log.addLog(this.#playerInfo(), 'is downsized');
    this.#log.addLog(this.#playerInfo(), `paid expenses $${amount}`);

    this.respond();
  }

  baby() {
    let message = 'already have 3 babies';
    if (this.#currentPlayer.baby()) {
      message = 'got new baby';
    }
    this.#log.addLog(this.#playerInfo(), message);

    this.respond();
  }

  #updateLotteryAmount(amount, status) {
    const messages = {
      4: `won $${amount}`,
      5: 'lost the lottery'
    };

    this.#currentPlayer.updateLotteryAmount(amount);
    this.#log.addLog(this.#playerInfo(), messages[status]);
    this.setTransactionState('deal', status);
    this.respond();
  }

  #decideMoneyLottery(diceValue) {
    const { success, outcome } = this.#card;
    if (success.includes(diceValue)) {
      const amount = outcome['success'];
      this.#updateLotteryAmount(amount, 4);
      return;
    }

    const amount = outcome['failure'];
    this.#updateLotteryAmount(amount, 5);
  }

  #hasGivenStock(player) {
    return player.hasStock(this.#card);
  }

  #splitStocks(player) {
    player.splitStocks(this.#card);
  }

  #reverseSplitStocks(player) {
    player.reverseSplitStocks(this.#card);
  }

  #decideSplitOrReverse(players, diceValue) {
    const { success } = this.#card;
    const playersHavingStock = players.filter((player) => this.#hasGivenStock(player));

    if (success.includes(diceValue)) {
      playersHavingStock.forEach((player) => this.#splitStocks(player));
      this.#currentPlayer.deactivateReroll();
      this.respond();
      return;
    }
    playersHavingStock.forEach((player) => this.#reverseSplitStocks(player));
    this.#currentPlayer.deactivateReroll();
    this.respond();
  }

  #decideLottery(players, diceValue) {
    const { lottery } = this.#card;

    if (lottery === 'money') {
      this.#decideMoneyLottery(diceValue);
    }

    if (lottery === 'stock') {
      this.#decideSplitOrReverse(players, diceValue);
    }
  }

  lottery(players, diceValue) {
    this.#decideLottery(players, diceValue);
  }

  skip(username) {
    this.#log.addLog(this.#playerInfo(), `skipped ${this.#card.symbol}`);

    this.respond(username);
  }

  setTurnCompleted(state) {
    this.#turnCompleted = state;
  }

  updateCard(card) {
    if (card.type === 'stock' && card.family === 'deal') {
      this.#response.forGroup();
    }
    this.#card = card;
  }

  // updatePlayer(player) {
  //   this.#currentPlayer = player;
  // }

  canPlayerContinue() {
    return this.#currentPlayer.canContinue();
  }

  sellStocks(username, count) {
    this.setTransactionState('deals', 2);
    this.#log.addLog(this.#playerInfo(), `sold ${count} ${this.#card.symbol} stocks`);

    this.respond(username);
  }

  propertyDamage() {
    const status = this.#currentPlayer.payDamages(this.#card);
    this.setTransactionState('market', status);
    let message = 'has no real estate';
    if (status) {
      message = `paid $${this.#card.cost} for damages`;
    }

    this.#log.addLog(this.#playerInfo(), message);

    this.respond();
  }

  get info() {
    const state = this.#response.isReceived(this.#currentPlayer.username);

    return {
      player: this.#currentPlayer,
      card: this.#card, //No need of card
      state,
      // state: this.#turnCompleted,
      transaction: this.#currentTransaction
    };
  }
}

module.exports = { Turn };
