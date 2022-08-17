class Profile {
  #profession;
  #income;
  #expenses;
  #assets;
  #liabilities;
  #cash;

  constructor({ profession, income, expenses, assets, liabilities }) {
    this.#profession = profession;
    this.#income = income;
    this.#expenses = expenses;
    this.#assets = assets;
    this.#liabilities = liabilities;
    this.#cash = 0;
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

    Object.values(this.#expenses).forEach(val => {
      totalExpenses += val;
    });

    return totalExpenses;
  }

  addPay() {
    this.updateCash(this.#calculateCashFlow());
  }

  deductDoodad(cost) {
    this.updateCash(-cost);
  }

  addAsset(card) {
    if (this.#cash < card.downPayment) {
      return;
    }

    this.#assets.realEstates.push(card);
    this.#income.realEstates.push(card);
    this.#liabilities.realEstates.push(card);
    this.updateCash(-card.downPayment);
  }

  updateCash(amount) {
    this.#cash += amount;
  }

  get details() {
    return {
      profession: this.#profession,
      income: this.#income,
      expenses: this.#expenses,
      assets: this.#assets,
      liabilities: this.#liabilities,
      totalIncome: this.#calculateTotalIncome(),
      totalExpenses: this.#calculateTotalExpenses(),
      cashFlow: this.#calculateCashFlow(),
      passiveIncome: this.#calculatePassiveIncome(),
      cash: this.#cash
    };
  }
}

module.exports = { Profile };
