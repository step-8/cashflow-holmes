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
    this.#currentTransaction = null;
  }

  #playerInfo() {
    const username = this.#currentPlayer.details.username;
    const color = this.#currentPlayer.details.color;
    return { username, color };
  }

  #cashflow() {
    return this.#currentPlayer.details.profile.cashFlow;
  }

  resetTransaction() {
    this.#currentTransaction = null;
  }

  set transactionState(status) {
    this.#currentTransaction = { family: this.#card.family, status };
  }

  payday() {
    this.#currentPlayer.payday();
    this.#log.addLog(this.#playerInfo(), `received pay of $${this.#cashflow()}`);
    this.#turnCompleted = true;
  }

  doodad() {
    const cost = this.#card.cost;
    const status = this.#currentPlayer.doodad(cost);
    this.transactionState = status;
    if (!status) {
      return;
    }

    this.#log.addLog(this.#playerInfo(), `payed $${cost} on ${this.#card.heading}`);
    this.#turnCompleted = true;
  }

  buyRealEstate() {
    const status = this.#currentPlayer.buyRealEstate(this.#card);
    this.transactionState = status;
    if (!status) {
      return;
    }
    this.#log.addLog(this.#playerInfo(), `bought ${this.#card.symbol}`);
    this.#turnCompleted = true;
  }

  skip() {
    this.#log.addLog(this.#playerInfo(), `skipped ${this.#card.symbol}`);
    this.#turnCompleted = true;
  }

  set turnComplete(state) {
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
