class Profile {
  #profession;
  #income;
  #babies;
  #expenses;
  #assets;
  #liabilities;
  #cash;
  #transactions;

  constructor({ profession, babies, income, expenses, assets, liabilities }) {
    this.#profession = profession;
    this.#income = income;
    this.#babies = babies;
    this.#expenses = expenses;
    this.#assets = assets;
    this.#liabilities = liabilities;
    this.#cash = 0;
    this.#transactions = [];
  }

  setDefaults() {
    this.#cash = this.#calculateCashFlow() + this.#assets.savings;
  }

  #calculatePassiveIncome() {
    let passiveIncome = 0;

    this.#income.realEstates.forEach(realEstate => {
      passiveIncome += realEstate.cashFlow;
    });

    return passiveIncome;
  }

  #calculateCashFlow() {
    return this.#calculateTotalIncome() - this.#calculateTotalExpenses();
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

  addPay() {
    this.updateCash(this.#calculateCashFlow(), 'Payday');
  }

  deductDoodad(cost) {
    if (this.#cash < cost) {
      return 0;
    }

    this.updateCash(-cost, 'Doodad');
    return 1;
  }

  addAsset(card) {
    if (this.#cash < card.downPayment) {
      return 0;
    }

    this.#assets.realEstates.push(card);
    this.#income.realEstates.push(card);
    this.#liabilities.realEstates.push(card);
    this.updateCash(-card.downPayment, card.symbol);
    return 1;
  }

  addStocks(card, count) {
    const totalCost = card.price * count;
    if (this.#cash < totalCost) {
      return 0;
    }

    this.#assets.stocks.push({ ...card, count });
    this.updateCash(-totalCost, card.symbol);
    return 1;
  }

  #recordToLedger(transaction) {
    this.#transactions.unshift(transaction);
  }

  donateCash() {
    const amount = 0.1 * this.#calculateTotalIncome();
    if (this.#cash < amount) {
      return 0;
    }

    this.updateCash(-amount, 'Charity');
    return 1;
  }

  payExpenses() {
    const amount = this.#calculateTotalExpenses();
    if (this.#cash < amount) {
      return 0;
    }

    this.updateCash(-amount, 'Downsized');
    return 1;
  }

  updateCash(amount, details) {
    const currentCash = this.#cash;
    this.#cash += amount;

    const totalCash = this.#cash;
    this.#recordToLedger(
      { currentCash, totalCash, amount, description: details }
    );
  }

  addLoan(amount) {
    this.updateCash(amount, 'Took loan');
    this.#liabilities.bankLoan += amount;
    this.#expenses.bankLoanPayment = this.#liabilities.bankLoan / 10;
    return true;
  }

  deductLoan(amount) {
    if (amount > this.#liabilities.bankLoan) {
      amount = this.#liabilities.bankLoan;
    }

    if (this.#cash < amount) {
      return false;
    }

    this.updateCash(-amount, 'Paid loan');
    this.#liabilities.bankLoan -= amount;
    this.#expenses.bankLoanPayment = this.#liabilities.bankLoan / 10;
    return true;
  }

  addBaby() {
    if (this.#babies > 2) {
      return false;
    }
    this.#babies++;
    return true;
  }

  hasEnoughCash() {
    return this.#cash > 0;
  }

  get details() {
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
}

module.exports = { Profile };
