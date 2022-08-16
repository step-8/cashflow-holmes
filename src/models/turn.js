class Turn {
  #card;
  #currentPlayer;
  #turnCompleted;

  constructor(card, currentPlayer) {
    this.#card = card;
    this.#currentPlayer = currentPlayer;
    this.#turnCompleted = false;
  }

  payday() {
    this.#currentPlayer.payday();
    this.#turnCompleted = true;
  }

  doodad() {
    this.#currentPlayer.doodad(this.#card.cost);
    this.#turnCompleted = true;
  }

  skip() {
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

  get info() {
    return {
      player: this.#currentPlayer,
      card: this.#card, //No need of card
      state: this.#turnCompleted
    };
  }
}

module.exports = { Turn };
