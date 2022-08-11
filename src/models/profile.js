class Profile {
  #profession;
  #income;
  #expenses;
  #assets;
  #liabilities;
  #passiveIncome;

  constructor({ profession, income, expenses, assets, liabilities }) {
    this.#profession = profession;
    this.#income = income;
    this.#expenses = expenses;
    this.#assets = assets;
    this.#liabilities = liabilities;
    this.#passiveIncome = 0;
  }

  calculateCashFlow() {
    return this.calculateTotalIncome() - this.calculateTotalExpenses();
  }

  calculateTotalIncome() {
    return this.#income.salary;
  }

  calculateTotalExpenses() {
    let totalExpenses = 0;

    Object.values(this.#expenses).forEach(val => {
      totalExpenses += val;
    });

    return totalExpenses;
  }

  get details() {
    return {
      profession: this.#profession,
      income: this.#income,
      expenses: this.#expenses,
      assets: this.#assets,
      liabilities: this.#liabilities,
      totalIncome: this.calculateTotalIncome(),
      totalExpenses: this.calculateTotalExpenses(),
      cashFlow: this.calculateCashFlow(),
      passiveIncome: this.#passiveIncome,
      cash: this.calculateTotalIncome() - this.calculateTotalExpenses() + this.#assets.savings
    };
  }
}

module.exports = { Profile };
