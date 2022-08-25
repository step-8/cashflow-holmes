class Player {
  #username;
  #color;
  #role;
  #profession;
  #income;
  #babies;
  #expenses;
  #assets;
  #liabilities;
  #cash;
  #transactions;
  #isRolledDice;
  #currentPosition;
  #lastPosition;
  #dualDiceCount;
  #skippedTurns;
  #canReRoll;
  #isInFastTrack;

  constructor(username, role, color, { profession, babies, income, expenses, assets, liabilities }) {
    this.#username = username;
    this.#role = role;
    this.#color = color;
    this.#profession = profession;
    this.#income = income;
    this.#babies = babies;
    this.#expenses = expenses;
    this.#assets = assets;
    this.#liabilities = liabilities;
    this.#cash = 0;
    this.#transactions = [];
    this.#isRolledDice = false;
    this.#currentPosition = 0;
    this.#lastPosition = 0;
    this.#dualDiceCount = 0;
    this.#skippedTurns = 0;
    this.#canReRoll = false;
    this.#isInFastTrack = false;
  }

  #calculateCashFlow() {
    return this.#calculateTotalIncome() - this.#calculateTotalExpenses();
  }

  #calculatePassiveIncome() {
    let passiveIncome = 0;

    this.#income.realEstates.forEach(realEstate => {
      passiveIncome += realEstate.cashFlow;
    });

    return passiveIncome;
  }

  #calculateTotalIncome() {
    return this.#income.salary + this.#calculatePassiveIncome();
  }

  #calculateTotalExpenses() {
    let totalExpenses = 0;

    Object.entries(this.#expenses).forEach(([key, val]) => {
      if (key === 'perChildExpense') {
        val = this.#babies * val;
      }
      totalExpenses += val;
    });

    return totalExpenses;
  }

  setDefaults() {
    this.#cash = this.#calculateCashFlow() +
      this.#assets.savings;
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

  allowReroll() {
    this.changeDiceStatus(false);
    this.#canReRoll = true;
  }

  deactivateReroll() {
    this.changeDiceStatus(true);
    this.#canReRoll = false;
  }

  initializeSkippedTurns() {
    this.#skippedTurns = 2;
  }

  decrementSkippedTurns() {
    this.#skippedTurns--;
  }

  payday() {
    this.updateCash(this.#calculateCashFlow(), 'Payday');
    return true;
  }

  doodad(cost) {
    if (this.#cash < cost) {
      return 0;
    }

    this.updateCash(-cost, 'Doodad');
    return 1;
  }

  buyRealEstate(card) {
    if (this.#cash < card.downPayment) {
      return 0;
    }

    this.#assets.realEstates.push(card);
    this.#income.realEstates.push(card);
    this.#liabilities.realEstates.push(card);
    this.updateCash(-card.downPayment, card.symbol);
    this.#setFastTrack();
    return 1;
  }

  buyStocks(card, count) {
    const totalCost = card.price * count;
    if (this.#cash < totalCost) {
      return 0;
    }

    const stock = this.#findStock(card);
    if (stock) {
      const existingTotalCost = stock.count * stock.price;
      const totalCount = count + stock.count;
      stock.price = (existingTotalCost + totalCost) / totalCount;
      stock.count = totalCount;
      this.updateCash(-totalCost, card.symbol);
      return 1;
    }

    this.#assets.stocks.push({ ...card, count });
    this.updateCash(-totalCost, card.symbol);
    return 1;
  }

  #findStock(card) {
    return this.#assets.stocks.find(stock => stock.symbol === card.symbol);
  }

  #findStockIndex(card) {
    return this.#assets.stocks.findIndex(stock => stock.symbol === card.symbol);
  }

  #removeStock(stock) {
    const stockIndex = this.#findStockIndex(stock);
    this.#assets.stocks.splice(stockIndex, 1);
  }

  sellStocks(card, count) {
    const stock = this.#findStock(card);
    const totalCost = card.price * count;

    if (stock.count < count) {
      return false;
    }

    stock.count -= count;
    this.updateCash(totalCost, card.symbol);

    if (stock.count <= 0) {
      this.#removeStock(stock);
    }
    return true;
  }

  #recordToLedger(transaction) {
    this.#transactions.unshift(transaction);
  }

  isIncomeStable() {
    return this.#calculatePassiveIncome() > this.#calculateTotalExpenses();
  }

  #setFastTrack() {
    if (this.isIncomeStable()) {
      this.#isInFastTrack = true;
      return;
    }
    this.#isInFastTrack = false;
  }

  charity() {
    const amount = 0.1 * this.#calculateTotalIncome();
    if (this.#cash < amount) {
      return 0;
    }

    this.updateCash(-amount, 'Charity');
    return 1;
  }

  downsized() {
    const amount = this.#calculateTotalExpenses();
    if (this.#cash < amount) {
      return 0;
    }

    this.updateCash(-amount, 'Downsized');
    return 1;
  }

  buyLottery(cost) {
    if (this.#cash < cost) {
      return 0;
    }

    this.updateCash(-cost, 'Lottery');
    this.allowReroll();
    return 1;
  }

  updateCash(amount, details) {
    const currentCash = this.#cash;
    this.#cash += amount;

    const totalCash = this.#cash;
    this.#recordToLedger(
      { currentCash, totalCash, amount, description: details }
    );
    return true;
  }

  takeLoan(amount) {
    this.updateCash(amount, 'Took loan');
    this.#liabilities.bankLoan += amount;
    this.#expenses.bankLoanPayment = this.#liabilities.bankLoan / 10;
    return true;
  }

  payLoan(amount) {
    if (amount > this.#liabilities.bankLoan) {
      amount = this.#liabilities.bankLoan;
    }

    if (this.#cash < amount) {
      return false;
    }

    this.updateCash(-amount, 'Paid loan');
    this.#liabilities.bankLoan -= amount;
    this.#expenses.bankLoanPayment = this.#liabilities.bankLoan / 10;
    this.#setFastTrack();
    return true;
  }

  baby() {
    if (this.#babies > 2) {
      return false;
    }
    this.#babies++;
    return true;
  }

  canContinue() {
    return this.#cash > 0;
  }

  hasStock(card) {
    return this.#findStock(card);
  }

  splitStocks(card) {
    const stock = this.#findStock(card);
    stock.count *= 2;
    this.deactivateReroll();
  }

  reverseSplitStocks(card) {
    const stock = this.#findStock(card);
    stock.count = Math.ceil(stock.count / 2);
    this.deactivateReroll();
  }

  move(steps) {
    this.#lastPosition = this.#currentPosition;
    this.#currentPosition = (this.#currentPosition + steps) % 24;
    if (this.#currentPosition === 0) {
      this.#currentPosition = 24;
    }
  }

  updateLotteryAmount(amount) {
    this.deactivateReroll();
    return this.updateCash(amount, 'Lottery');
  }

  profile() {
    return {
      profession: this.#profession,
      income: this.#income,
      babies: this.#babies,
      expenses: this.#expenses,
      assets: this.#assets,
      liabilities: this.#liabilities,
      totalIncome: this.#calculateTotalIncome(),
      totalExpenses: this.#calculateTotalExpenses(),
      cashFlow: this.#calculateCashFlow(),
      passiveIncome: this.#calculatePassiveIncome(),
      transactions: this.#transactions,
      cash: this.#cash
    };
  }

  get skippedTurns() {
    return this.#skippedTurns;
  }

  get color() {
    return this.#color;
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

  get details() {
    return {
      username: this.#username,
      role: this.#role,
      color: this.#color,
      profile: this.profile(),
      profession: this.#profession,
      isRolledDice: this.#isRolledDice,
      lastPosition: this.#lastPosition,
      currentPosition: this.#currentPosition,
      dualDiceCount: this.#dualDiceCount,
      skippedTurns: this.#skippedTurns,
      canReRoll: this.#canReRoll,
      isInFastTrack: this.#isInFastTrack
    };
  }
}

module.exports = { Player };
