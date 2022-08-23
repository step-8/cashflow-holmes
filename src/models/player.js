class Player {
  #username;
  #color;
  #role;
  #profile;
  #profession;
  #isRolledDice;
  #currentPosition;
  #lastPosition;
  #dualDiceCount;
  #skippedTurns;
  #canReRoll;

  constructor(username, role, color, profession, profile) {
    this.#username = username;
    this.#role = role;
    this.#color = color;
    this.#profession = profession;
    this.#profile = profile;
    this.#isRolledDice = false;
    this.#currentPosition = 0;
    this.#lastPosition = 0;
    this.#dualDiceCount = 0;
    this.#skippedTurns = 0;
  }

  changeDiceStatus(status) {
    this.#isRolledDice = status;
  }

  initializeDualDiceCount() {
    this.#dualDiceCount = 3;
  }

  decrementDualDiceCount() {
    this.#dualDiceCount--;
  }

  get dualDiceCount() {
    return this.#dualDiceCount;
  }

  get isRolledDice() {
    return this.#isRolledDice;
  }

  get username() {
    return this.#username;
  }

  get currentPosition() {
    return this.#currentPosition;
  }

  initializeSkippedTurns() {
    this.#skippedTurns = 2;
  }

  decrementSkippedTurns() {
    this.#skippedTurns--;
  }

  get skippedTurns() {
    return this.#skippedTurns;
  }

  get color() {
    return this.#color;
  }

  payday() {
    this.#profile.addPay();
  }

  canContinue() {
    return this.#profile.hasEnoughCash();
  }

  doodad(cost) {
    return this.#profile.deductDoodad(cost);
  }

  buyRealEstate(card) {
    return this.#profile.addAsset(card);
  }

  buyLottery(cost) {
    const status = this.#profile.lottery(cost);
    if (status) {
      this.changeDiceStatus(false);
      this.#canReRoll = true;
    }
    return status;
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

  baby() {
    return this.#profile.addBaby();
  }

  move(steps) {
    this.#lastPosition = this.#currentPosition;
    this.#currentPosition = (this.#currentPosition + steps) % 24;
    if (this.#currentPosition === 0) {
      this.#currentPosition = 24;
    }
  }

  takeLoan(amount) {
    return this.#profile.addLoan(amount);
  }

  payLoan(amount) {
    return this.#profile.deductLoan(amount);
  }

  sellStocks(stock, count) {
    return this.#profile.deductStocks(stock, count);
  }

  get details() {
    return {
      username: this.#username,
      role: this.#role,
      color: this.#color,
      profile: this.#profile.details,
      profession: this.#profession,
      isRolledDice: this.#isRolledDice,
      lastPosition: this.#lastPosition,
      currentPosition: this.#currentPosition,
      dualDiceCount: this.#dualDiceCount,
      skippedTurns: this.#skippedTurns,
      canReRoll: this.#canReRoll
    };
  }
}

module.exports = { Player };
