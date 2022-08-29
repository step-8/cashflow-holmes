const multiUserFlow = (family, type) => {
  const multiFlows = {
    deal: {
      stock: true
    },
    market: {
      goldCoins: true
    }
  };
  return multiFlows[family]?.[type];
};
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
    this.#currentTransaction = null;
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

  setTransactionState(family, status, username) {
    this.#currentTransaction = { family, status, username };
  }

  #changeTurnIfNoCard(username) {
    if (this.#card.id) {
      return;
    }
    this.respond(username);
  }

  payday(player) {
    const status = this.#currentPlayer.payday();
    this.#log.addLog(this.#currentPlayer, `received pay of $${this.#cashflow()}`);

    this.setTransactionState('payday', 1, this.#currentPlayer.username);
    if (status) {
      this.#changeTurnIfNoCard(player.username);
    }
    return status;
  }

  doodad(player) {
    const cost = this.#card.cost;
    const status = player.doodad(cost);

    this.setTransactionState('doodad', status, player.username);
    if (!status) {
      return;
    }

    this.#log.addLog(player, `payed $${cost} on ${this.#card.heading}`);
    this.respond(player.username);
  }

  buyLottery(player) {
    const { cost, type } = this.#card;
    const status = player.buyLottery(cost);
    this.setTransactionState('deal', status, player.username);

    if (!status) {
      return;
    }

    this.#log.addLog(player, `bought ${type} for $${cost}`);
  }

  buyRealEstate(player) {
    const status = player.buyRealEstate(this.#card);
    this.setTransactionState('deal', status, player.username);
    if (!status) {
      return;
    }
    this.#log.addLog(player, `bought ${this.#card.symbol}`);
    this.respond(player.username);
  }

  buyStocks(player, count) {
    const status = player.buyStocks(this.#card, count);
    this.setTransactionState('deal', status, player.username);

    if (!status) {
      return;
    }
    this.#log.addLog(player, `bought ${count} ${this.#card.symbol} stocks`);
    this.respond(player.username);
  }

  buyGoldCoins(player) {
    const status = player.addGoldCoins(this.#card);
    this.setTransactionState('deal', status, player.username);
    this.#log.addLog(player, `bought ${this.#card.count} gold coins`);
    this.respond(player.username);
  }

  charity(player) {
    const amount = 0.1 * player.details.profile.totalIncome;
    const status = player.charity();
    this.setTransactionState('charity', status, player.username);

    if (!status) {
      return;
    }

    player.incrementDualDiceCount();
    this.#log.addLog(player, `donated $${amount} to charity`);
    this.respond(player.username);
  }

  downsized(player) {
    const amount = player.details.profile.totalExpenses;
    const status = player.downsized();
    this.setTransactionState('downsized', status, player.username);

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

    this.respond(player.username);
  }

  #updateLotteryAmount(amount, status) {
    const username = this.#currentPlayer.username;
    const messages = {
      4: `won $${amount}`,
      5: 'lost the lottery'
    };

    this.#currentPlayer.updateLotteryAmount(amount);
    this.#log.addLog(this.#currentPlayer, messages[status]);
    this.setTransactionState('deal', status, username);
    this.respond(username);
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
    this.setTransactionState('market', status, player.username);
    this.respond(player.username);
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

  skip(player) {
    this.#log.addLog(player, `skipped ${this.#card.symbol}`);
    this.respond(player.username);
  }

  setTurnCompleted(state) {
    this.#turnCompleted = state;
  }

  updateCard(card) {
    if (multiUserFlow(card.family, card.type)) {
      this.#response.forGroup();
    }
    this.#card = card;
  }

  canPlayerContinue() {
    return this.#currentPlayer.canContinue();
  }

  sellStocks(player, count) {
    this.setTransactionState('deals', 2, player.username);
    this.#log.addLog(player, `sold ${count} ${this.#card.symbol} stocks`);

    this.respond(player.username);
  }

  sellGold(player, count) {
    this.setTransactionState('market', 5, player.username);
    this.#log.addLog(player, `sold gold coins of count ${count}`);

    this.respond(player.username);
  }

  propertyDamage(player) {
    const status = player.payDamages(this.#card);
    this.setTransactionState('market', status, player.username);

    if (status === 6) {
      return;
    }

    let message = 'has no real estate';
    if (status) {
      message = `paid $${this.#card.cost} for damages`;
    }

    this.#log.addLog(player, message);
    this.respond(player.username);
  }

  get responses() {
    return this.#response.collection;
  }

  get info() {
    const state = this.#response.isReceived(this.#currentPlayer.username);
    return {
      player: this.#currentPlayer,
      card: this.#card, //No need of card
      state,
      transaction: this.#currentTransaction
    };
  }
}

module.exports = { Turn, multiUserFlow };
