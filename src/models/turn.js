class Turn {
  #card;
  #currentPlayer;
  #turnCompleted;
  #log;
  #currentTransaction;

  constructor(card, currentPlayer, log) {
    this.#card = card;
    this.#currentPlayer = currentPlayer;
    this.#turnCompleted = false;
    this.#log = log;
  }

  #playerInfo() {
    const username = this.#currentPlayer.username;
    const color = this.#currentPlayer.color;
    return { username, color };
  }

  #cashflow() {
    return this.#currentPlayer.details.profile.cashFlow;
  }

  resetTransaction() {
    this.#currentTransaction = null;
  }

  setTransactionState(family, status) {
    this.#currentTransaction = { family, status };
  }

  #changeTurnIfNoCard() {
    if (this.#card.id) {
      return;
    }
    this.#turnCompleted = true;
  }

  payday() {
    this.#currentPlayer.payday();
    this.#log.addLog(this.#playerInfo(), `received pay of $${this.#cashflow()}`);
    this.setTransactionState('payday', 1);
    this.#changeTurnIfNoCard();
  }

  doodad() {
    const cost = this.#card.cost;
    const status = this.#currentPlayer.doodad(cost);
    this.setTransactionState('doodad', status);
    if (!status) {
      return;
    }

    this.#log.addLog(this.#playerInfo(), `payed $${cost} on ${this.#card.heading}`);
    this.#turnCompleted = true;
  }

  buyRealEstate() {
    const status = this.#currentPlayer.buyRealEstate(this.#card);
    this.setTransactionState('deal', status);
    if (!status) {
      return;
    }
    this.#log.addLog(this.#playerInfo(), `bought ${this.#card.symbol}`);
    this.#turnCompleted = true;
  }

  buyStocks(count) {
    const status = this.#currentPlayer.buyStocks(this.#card, count);
    this.setTransactionState('deal', status);
    if (!status) {
      return;
    }
    this.#log.addLog(this.#playerInfo(), `bought ${count} ${this.#card.symbol} stocks`);
    this.#turnCompleted = true;
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
    this.#turnCompleted = true;
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
    this.#turnCompleted = true;
  }

  baby() {
    let message = 'already have 3 babies';
    if (this.#currentPlayer.baby()) {
      message = 'got new baby';
    }
    this.#log.addLog(this.#playerInfo(), message);
    this.#turnCompleted = true;
  }

  skip() {
    this.#log.addLog(this.#playerInfo(), `skipped ${this.#card.symbol}`);
    this.#turnCompleted = true;
  }

  setTurnCompleted(state) {
    this.#turnCompleted = state;
  }

  updateCard(card) {
    this.#card = card;
  }

  updatePlayer(player) {
    this.#currentPlayer = player;
  }

  canPlayerContinue() {
    return this.#currentPlayer.canContinue();
  }

  sellStocks(count) {
    return;
  }

  get info() {
    return {
      player: this.#currentPlayer,
      card: this.#card, //No need of card
      state: this.#turnCompleted,
      transaction: this.#currentTransaction
    };
  }
}

module.exports = { Turn };
