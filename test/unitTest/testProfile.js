const { Profile } = require('../../src/models/profile');
const professions = require('../../data/professions.json');
const { assert } = require('chai');

describe('Profile', () => {
  const profession = JSON.stringify(professions[0]);

  it('Should get details of profile', () => {
    const profile = new Profile(JSON.parse(profession));
    const expectedProfession = 'Doctor(MD)';
    assert.strictEqual(profile.details.profession, expectedProfession);
  });

  it('Should set defaults for the profile', () => {
    const profile = new Profile(JSON.parse(profession));
    profile.setDefaults();
    assert.strictEqual(profile.details.cash, 8400);
  });

  it('Should calculate the total income', () => {
    const profile = new Profile(JSON.parse(profession));
    const expectedTotalIncome = 13200;
    assert.strictEqual(profile.details.totalIncome, expectedTotalIncome);
  });

  it('Should calculate the total expenses', () => {
    const profile = new Profile(JSON.parse(profession));
    const expectedTotalExpenses = 8300;
    assert.strictEqual(profile.details.totalExpenses, expectedTotalExpenses);
  });

  it('Should calculate the cash flow', () => {
    const profile = new Profile(JSON.parse(profession));
    const expectedCF = 4900;
    assert.strictEqual(profile.details.cashFlow, expectedCF);
  });

  it('Should calculate the passive income', () => {
    const profile = new Profile(JSON.parse(profession));
    const expectedPassiveIncome = 0;
    assert.strictEqual(profile.details.passiveIncome, expectedPassiveIncome);
  });

  describe('addPay', () => {
    it('Should add cashflow amount to the cash', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      profile.addPay();
      assert.strictEqual(profile.details.cash, 13300);
    });
  });

  describe('payExpenses', () => {
    it('Should not deduct amount from the cash', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      assert.isOk(profile.payExpenses() !== 0);
      assert.strictEqual(profile.details.cash, 100);
    });

    it('Should deduct amount from the cash', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      profile.addPay();
      assert.isOk(profile.payExpenses() === 1);
      assert.strictEqual(profile.details.cash, 5000);
    });
  });

  describe('donateCash', () => {
    it('Should not deduct amount from the cash', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      profile.payExpenses();
      profile.payExpenses();
      assert.isNotOk(profile.donateCash());
    });

    it('Should deduct amount from the cash', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      assert.isOk(profile.donateCash());
      assert.strictEqual(profile.details.cash, 7080);
    });
  });

  describe('addStocks', () => {
    const card = {
      heading: 'New Card',
      symbol: 'a',
      price: 5,
      family: 'deal',
      type: 'stock'
    };

    it('Should not add stocks to the player', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      assert.isOk(profile.addStocks(card, 10000) === 0);
    });

    it('Should add stocks to the player', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      assert.isOk(profile.addStocks(card, 100) === 1);
      assert.deepStrictEqual(profile.details.assets.stocks[0].count, 100);
    });
  });

  describe('deductDoodad', () => {
    it('Should deduct doodad amount from the cash', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      profile.deductDoodad(100);
      assert.strictEqual(profile.details.cash, 8300);
    });
  });

  describe('lottery', () => {
    it('Should deduct lottery amount from the cash on successful purchase', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      profile.buyLottery(100);
      assert.strictEqual(profile.details.cash, 8300);
    });

    it('Should not deduct lottery amount from the cash on unsuccessful purchase', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      profile.buyLottery(100000);
      assert.strictEqual(profile.details.cash, 8400);
    });
  });

  describe('addAsset', () => {
    it('Should not add asset if player has insufficient cash', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      profile.deductDoodad(100);
      const status = profile.addAsset({ downPayment: 300000 });
      assert.isOk(!status);
    });

    it('Should add card to assets', () => {
      const profile = new Profile(JSON.parse(profession));
      const card = { downPayment: 300 };
      profile.setDefaults();
      profile.deductDoodad(100);
      profile.addAsset(card);
      assert.deepStrictEqual(profile.details.assets.realEstates[0], card);
    });

    it('Should add card to liabilities', () => {
      const profile = new Profile(JSON.parse(profession));
      const card = { downPayment: 300 };
      profile.setDefaults();
      profile.deductDoodad(100);
      profile.addAsset(card);
      assert.deepStrictEqual(profile.details.liabilities.realEstates[0], card);
    });

    it('Should add card to income', () => {
      const profile = new Profile(JSON.parse(profession));
      const card = { downPayment: 300 };
      profile.setDefaults();
      profile.deductDoodad(100);
      profile.addAsset(card);
      assert.deepStrictEqual(profile.details.income.realEstates[0], card);
    });
  });

  describe('addLoan', () => {
    it('Should add amount to the cash', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      const expected = profile.details;
      const expectedCash = profile.details.cash;
      const expectedBankLoanPayment = profile.details.expenses.bankLoanPayment;
      profile.addLoan(100);
      const actual = profile.details;

      assert.deepStrictEqual(actual.totalExpenses, expected.totalExpenses + 10);
      assert.deepStrictEqual(actual.cash, expectedCash + 100);
      assert.deepStrictEqual(actual.expenses.bankLoanPayment, expectedBankLoanPayment + 10);
    });
  });

  describe('deductLoan', () => {
    it('Should deduct amount from the cash', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      profile.addLoan(100);
      const expected = profile.details;
      const expectedCash = profile.details.cash;
      const expectedBankLoanPayment = profile.details.expenses.bankLoanPayment;
      profile.deductLoan(100);
      const actual = profile.details;

      assert.deepStrictEqual(actual.totalExpenses, expected.totalExpenses - 10);
      assert.deepStrictEqual(actual.cash, expectedCash - 100);
      assert.deepStrictEqual(actual.expenses.bankLoanPayment, expectedBankLoanPayment - 10);
    });

    it('Should not deduct amount when there is no bank loan', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      const actual = profile.deductLoan(1200);
      assert.isOk(actual);
    });

    it('Should not deduct amount when there is no bank loan', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      profile.deductDoodad(10000);
      profile.addLoan(100);
      const actual = profile.deductLoan(1200);
      assert.isOk(actual);
    });
  });

  describe('addBaby', () => {
    it('Should add baby to player profile', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      assert.isOk(profile.addBaby());
    });

    it('Should not add baby when player have 3 babies', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      profile.addBaby();
      profile.addBaby();
      profile.addBaby();
      assert.isOk(!profile.addBaby());
    });
  });

  describe('isIncomeStable', () => {
    it('Should return false when income is unstable', () => {
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      assert.isNotOk(profile.isIncomeStable());
    });

    it('Should return true when income is stable', () => {
      const card = { cashFlow: 100000, downPayment: 5 };
      const profile = new Profile(JSON.parse(profession));
      profile.setDefaults();
      profile.addAsset(card);
      assert.isOk(profile.isIncomeStable());
    });
  });
});
