const { Profile } = require('./profile.js');
class Player {
  #username;
  #color;
  #profession;
  #role;
  #profile;
  #isRolledDice;
  #currentPosition;
  #lastPosition;
  #dualDiceCount;
  #skippedTurns;

  constructor(username, role) {
    this.#username = username;
    this.#role = role;
    this.#color = null;
    this.#profession = null;
    this.#profile = null;
    this.#isRolledDice = false;
    this.#currentPosition = 0;
    this.#lastPosition = 0;
    this.#dualDiceCount = 0;
    this.#skippedTurns = 0;
  }

  set rolledDice(status) {
    this.#isRolledDice = status;
  }

  set dualDiceCount(count) {
    this.#dualDiceCount = count;
  }

  get dualDiceCount() {
    return this.#dualDiceCount;
  }

  set skippedTurns(count) {
    this.#skippedTurns = count;
  }

  get skippedTurns() {
    return this.#skippedTurns;
  }

  assignColor(color) {
    this.#color = color;
  }

  assignProfession(profession) {
    this.#profession = profession;
  }

  createProfile() {
    this.#profile = new Profile(this.#profession);
    this.#profile.setDefaults();
  }

  payday() {
    this.#profile.addPay();
  }

  canContinue() {
    return this.#profile.details.cash > 0;
  }

  doodad(cost) {
    return this.#profile.deductDoodad(cost);
  }

  buyRealEstate(card) {
    return this.#profile.addAsset(card);
  }

  buyStocks(card, count) {
    return this.#profile.addStocks(card, count);
  }

  charity() {
    return this.#profile.donateCash();
  }

  downsized() {
    return this.#profile.payExpenses();
  }

  move(steps) {
    this.#lastPosition = this.#currentPosition;
    this.#currentPosition = (this.#currentPosition + steps) % 24;
    if (this.#currentPosition === 0) {
      this.#currentPosition = 24;
    }
  }

  takeLoan(amount) {
    this.#profile.addLoan(amount);
    return true;
  }

  payLoan(amount) {
    this.#profile.deductLoan(amount);
    return true;
  }

  get details() {
    return {
      username: this.#username,
      role: this.#role,
      color: this.#color,
      profession: this.#profession,
      profile: this.#profile.details,
      isRolledDice: this.#isRolledDice,
      lastPosition: this.#lastPosition,
      currentPosition: this.#currentPosition,
      dualDiceCount: this.#dualDiceCount,
      skippedTurns: this.#skippedTurns
    };
  }
}

module.exports = { Player };
