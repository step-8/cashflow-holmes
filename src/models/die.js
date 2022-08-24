class Die {
  #numberOfSides;
  #face;
  constructor(numberOfSides = 6) {
    this.#numberOfSides = numberOfSides;
    this.#face = 1;
  }

  roll() {
    this.#face = Math.ceil(Math.random() * this.#numberOfSides);
    return this.#face;
  }

  face() {
    return this.#face;
  }
}

class Dice {
  #numberOfSides;
  #numberOfDice;
  #dice;
  constructor(numberOfDice = 2, numberOfSides = 6) {
    this.#numberOfSides = numberOfSides;
    this.#numberOfDice = numberOfDice;
    this.#dice = Array(this.#numberOfDice).fill(new Die(this.#numberOfSides));
  }

  roll(numberOfDice = this.#numberOfDice) {
    return this.#dice.slice(0, numberOfDice).map(die => die.roll());
  }

  face(numberOfDice = this.#numberOfDice) {
    return this.#dice.slice(0, numberOfDice).map(die => die.face());
  }
}

class RiggedDice {
  #values;
  #face;
  constructor(values) {
    this.#values = values;
  }

  setNext(next) {
    return next;
  }

  roll() {
    this.#face = this.#values.pop();
    return this.#face;
  }

  face() {
    return this.#face;
  }
}

module.exports = { Die, Dice, RiggedDice };
