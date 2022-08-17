class Turn {
  #card;
  #currentPlayer;
  #turnCompleted;
  #log;

  constructor(card, currentPlayer, log) {
    this.#card = card;
    this.#currentPlayer = currentPlayer;
    this.#turnCompleted = false;
    this.#log = log;
  }

  #username() {
    return this.#currentPlayer.details.username;
  }

  payday() {
    this.#currentPlayer.payday();
    this.#log.addLog(this.#username(), 'received pay');
    this.#turnCompleted = true;
  }

  doodad() {
    const cost = this.#card.cost;
    this.#currentPlayer.doodad(cost);
    this.#log.addLog(this.#username(), `payed ${cost} on doodad`);
    this.#turnCompleted = true;
  }

  buyRealEstate() {
    this.#currentPlayer.buyRealEstate(this.#card);
    this.#log.addLog(this.#username(), `bought ${this.#card.symbol}`);
    this.#turnCompleted = true;
    return;
  }

  skip() {
    this.#log.addLog(this.#username(), 'skipped the card');
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
      state: this.#turnCompleted
    };
  }
}

module.exports = { Turn };
