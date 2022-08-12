class Turn {
  #card;
  #currentPlayer;
  #turnCompleted;

  constructor(card, currentPlayer) {
    this.#card = card;
    this.#currentPlayer = currentPlayer;
    this.#turnCompleted = false;
  }

  set turnComplete(state) {
    this.#turnCompleted = state;
  }

  get info() {
    return {
      card: this.#card,
      state: this.#turnCompleted
    };
  }
}

module.exports = { Turn };
