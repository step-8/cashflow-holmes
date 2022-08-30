const { camelToCapitalize } = require('../utils/commonLib.js');

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
  #hasBankrupt;
  #aboutToBankrupt;
  #hasMlm;

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
    this.#hasBankrupt = false;
    this.#aboutToBankrupt = false;
    this.#hasMlm = false;
  }

  init({ isRolledDice, lastPosition, currentPosition, dualDiceCount, skippedTurns, canReRoll, isInFastTrack, transactions, hasMlm }) {
    this.#isRolledDice = isRolledDice;
    this.#currentPosition = currentPosition;
    this.#lastPosition = lastPosition;
    this.#dualDiceCount = dualDiceCount;
    this.#skippedTurns = skippedTurns;
    this.#canReRoll = canReRoll;
    this.#isInFastTrack = isInFastTrack;
    this.#isInFastTrack = isInFastTrack;
    this.#transactions = transactions;
    this.#hasMlm = hasMlm;
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

  incrementDualDiceCount() {
    this.#dualDiceCount += 3;
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
    if (this.isBankrupt()) {
      this.#aboutToBankrupt = true;
    }
    return !this.isBankrupt();
  }

  doodad(card) {
    const cost = card.cost;
    if (card.isConditional && this.profile().babies <= 0) {
      return 2;
    }

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

    const stock = this.#findAsset(card, 'stocks');
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

  buyMlm(card) {
    if (this.#cash < card.cost) {
      return 0;
    }

    this.updateCash(-card.cost, card.symbol.toUpperCase());
    this.#hasMlm = true;
    return 1;
  }

  #findAsset(card, type) {
    return this.#assets[type].find(item => item.symbol === card.symbol);
  }

  #findAssetIndex(card, type) {
    return this.#assets[type].findIndex(item => item.symbol === card.symbol);
  }

  #removeAsset(card, type) {
    const index = this.#findAssetIndex(card, type);
    this.#assets[type].splice(index, 1);
  }

  sellGold(card, count) {
    const gold = this.#findAsset(card, 'preciousMetals');
    const totalCost = card.cost * count;

    if (gold.count < count) {
      return false;
    }

    gold.count -= count;
    this.updateCash(totalCost, card.symbol);

    if (gold.count <= 0) {
      this.#removeAsset(gold, 'preciousMetals');
    }
    return true;
  }

  sellStocks(card, count) {
    const stock = this.#findAsset(card, 'stocks');
    const totalCost = card.price * count;

    if (stock.count < count) {
      return false;
    }

    stock.count -= count;
    this.updateCash(totalCost, card.symbol);

    if (stock.count <= 0) {
      this.#removeAsset(stock, 'stocks');
    }
    return true;
  }

  #findRealEstate(id) {
    return this.#assets.realEstates.find((realEstate) => realEstate.id === id);
  }

  #removeRealEstate(id) {
    const index = this.#assets.realEstates.findIndex(
      realEstate => realEstate.id === id);

    this.#assets.realEstates.splice(index, 1);
    this.#liabilities.realEstates.splice(index, 1);
    this.#income.realEstates.splice(index, 1);
  }

  sellRealEstate(card, id) {
    const realEstate = this.#findRealEstate(id);
    const value = (realEstate.cost / 100) * card.value;
    let totalCost = realEstate.cost + value;

    if (card.plus) {
      totalCost = realEstate.cost + card.value;
    }

    this.updateCash(totalCost, card.symbol);
    this.#removeRealEstate(id);
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

  isBankrupt() {
    const cashFlow = this.#calculateCashFlow();
    return (this.#cash + cashFlow) < 0;
  }

  takeLoan(amount) {
    this.updateCash(amount, 'Took loan');
    this.#liabilities.bankLoan += amount;
    this.#expenses.bankLoanPayment = this.#liabilities.bankLoan / 10;

    if (this.isBankrupt()) {
      return false;
    }

    return true;
  }

  payLoan(amount, type) {
    if (this.#cash < amount) {
      return false;
    }

    const loanMapper = {
      homeMortgage: 'homeMortgagePayment',
      schoolLoans: 'schoolLoanPayment',
      carLoans: 'carLoanPayment',
      creditCardDebt: 'creditCardPayment'
    };

    this.updateCash(-amount, `Paid ${camelToCapitalize(type)}`);
    this.#liabilities[type] -= amount;

    if (type === 'bankLoan') {
      this.#expenses.bankLoanPayment = this.#liabilities[type] / 10;
    } else {
      this.#expenses[loanMapper[type]] = 0;
    }

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
    return this.#findAsset(card, 'stocks');
  }

  splitStocks(card) {
    const stock = this.#findAsset(card, 'stocks');
    stock.count *= 2;
    this.deactivateReroll();
  }

  reverseSplitStocks(card) {
    const stock = this.#findAsset(card, 'stocks');
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

  #hasRealEstate() {
    return this.#assets.realEstates.length;
  }

  payDamages(card) {
    if (this.#cash < card.cost) {
      return 6;
    }

    if (!this.#hasRealEstate()) {
      return 0;
    }

    this.updateCash(-card.cost, 'Property Damage');
    return 1;
  }

  addGoldCoins(card) {
    if (this.#cash < card.cost) {
      return 0;
    }

    this.#assets.preciousMetals.push(card);
    this.updateCash(-card.cost, 'Gold Coins');
    return 1;
  }

  #sellAssets(asset, key) {
    let totalCash = 0;

    this.#assets[asset].forEach(property => {
      totalCash += (property[key] / 2);
    });

    this.#assets[asset] = [];
    this.#income.realEstates = [];
    this.#liabilities.realEstates = [];
    return totalCash;
  }

  #sellAllStocks() {
    let totalCash = 0;

    this.#assets.stocks.forEach(({ price, count }) => {
      totalCash += ((count * price) / 2);
    });

    this.#assets.stocks = [];

    return totalCash;
  }

  sellAllAssets() {
    let cash = this.#sellAssets('realEstates', 'downPayment');

    cash += this.#sellAssets('preciousMetals', 'cost');
    cash += this.#sellAllStocks();
    this.#cash += cash;
    if (this.isBankrupt()) {
      this.#hasBankrupt = true;
    }
    return true;
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

  get isInFastTrack() {
    return this.#isInFastTrack;
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
      transactions: this.#transactions,
      currentPosition: this.#currentPosition,
      dualDiceCount: this.#dualDiceCount,
      skippedTurns: this.#skippedTurns,
      canReRoll: this.#canReRoll,
      isInFastTrack: this.#isInFastTrack,
      hasBankrupt: this.#hasBankrupt,
      aboutToBankrupt: this.#aboutToBankrupt,
      hasMlm: this.#hasMlm
    };
  }
}

module.exports = { Player };
