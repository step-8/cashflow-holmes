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
    this.respond(username);
  }

  payday(player) {
    player.payday();
    this.#log.addLog(player, `received pay of $${this.#cashflow()}`);

    this.setTransactionState('payday', 1);
    this.#changeTurnIfNoCard(player.username);
    return true;
  }

  doodad(player) {
    const cost = this.#card.cost;
    const status = player.doodad(cost);

    this.setTransactionState('doodad', status);
    if (!status) {
      return;
    }

    this.#log.addLog(player, `payed $${cost} on ${this.#card.heading}`);
    this.respond();
  }

  buyLottery(player) {
    const { cost, type } = this.#card;
    const status = player.buyLottery(cost);
    this.setTransactionState('deal', status);

    if (!status) {
      return;
    }

    this.#log.addLog(player, `bought ${type} for $${cost}`);
  }

  buyRealEstate(player) {
    const status = player.buyRealEstate(this.#card);
    this.setTransactionState('deal', status);
    if (!status) {
      return;
    }
    this.#log.addLog(player, `bought ${this.#card.symbol}`);
    this.respond(player.username);
  }

  buyStocks(player, count) {
    const status = player.buyStocks(this.#card, count);
    this.setTransactionState('deal', status);

    if (!status) {
      return;
    }
    this.#log.addLog(player, `bought ${count} ${this.#card.symbol} stocks`);
    this.respond(player.username);
  }

  buyGoldCoins(player) {
    const status = player.addGoldCoins(this.#card);
    this.setTransactionState('deal', status);
    this.#log.addLog(player, `bought ${this.#card.count} gold coins`);
    this.respond(player.username);
  }

  charity(player) {
    const amount = 0.1 * player.details.profile.totalIncome;
    const status = player.charity();
    this.setTransactionState('charity', status);

    if (!status) {
      return;
    }

    player.initializeDualDiceCount();
    this.#log.addLog(player, `donated $${amount} to charity`);
    this.respond(player.username);
  }

  downsized(player) {
    const amount = player.details.profile.totalExpenses;
    const status = player.downsized();
    this.setTransactionState('downsized', status);

    if (!status) {
      return;
    }

    player.initializeSkippedTurns();
    this.#log.addLog(player, 'is downsized');
    this.#log.addLog(player, `paid expenses $${amount}`);

    this.respond(player.username);
  }

  baby(player) {
    let message = 'already have 3 babies';
    if (player.baby()) {
      message = 'got new baby';
    }
    this.#log.addLog(player, message);

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

  #decideSplitOrReverse(players, player, diceValue) {
    const { success } = this.#card;
    const playersHavingStock = players.filter((player) => this.#hasGivenStock(player));
    let status = 2;
    if (success.includes(diceValue)) {
      playersHavingStock.forEach((player) => this.#splitStocks(player));
    } else {
      playersHavingStock.forEach((player) => this.#reverseSplitStocks(player));
      status = 3;
    }
    const messages = {
      2: `split ${this.#card.symbol} stocks`,
      3: `reverse split ${this.#card.symbol} stocks`
    };

    this.#log.addLog(this.#playerInfo(), messages[status]);
    this.#currentPlayer.deactivateReroll();
    this.setTransactionState('market', status);
    this.respond();
  }

  #decideLottery(players, player, diceValue) {
    const { lottery } = this.#card;

    if (lottery === 'money') {
      this.#decideMoneyLottery(diceValue);
    }

    if (lottery === 'stock') {
      this.#decideSplitOrReverse(players, player, diceValue);
    }
  }

  lottery(players, player, diceValue) {
    this.#decideLottery(players, player, diceValue);
  }

  pass(player) {
    this.#log.addLog(player, `passed ${this.#card.symbol}`);
    this.respond(player.username);
  }

  skip(player) {
    this.#log.addLog(player, `skipped ${this.#card.symbol}`);
    this.respond(player.username);
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

  canPlayerContinue() {
    return this.#currentPlayer.canContinue();
  }

  sellStocks(player, count) {
    this.setTransactionState('deals', 2);
    this.#log.addLog(player, `sold ${count} ${this.#card.symbol} stocks`);

    this.respond(player.username);
  }

  propertyDamage(player) {
    const status = player.payDamages(this.#card);
    this.setTransactionState('market', status);
    let message = 'has no real estate';

    if (status) {
      message = `paid $${this.#card.cost} for damages`;
    }

    this.#log.addLog(player, message);
    this.respond(player.username);
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
