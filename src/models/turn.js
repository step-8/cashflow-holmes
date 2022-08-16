class Turn {
  #card;
  #currentPlayer;
  #turnCompleted;

  constructor(card, currentPlayer) {
    this.#card = card;
    this.#currentPlayer = currentPlayer;
    this.#turnCompleted = false;
  }

  accept() {
    //Change player profile according to card options.
    //Add the card to player log.
    this.#currentPlayer;
    this.#card;
    this.#turnCompleted = true;
    return;
  }

  skip() {
    this.#turnCompleted = true;
    return;
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

  get info() {
    return {
      player: this.#currentPlayer,
      card: this.#card, //No need of card
      state: this.#turnCompleted
    };
  }
}

module.exports = { Turn };
