const { Profile } = require('../../src/models/profile');
const professions = require('../../data/professions.json');
const assert = require('assert');

describe('Profile', () => {
  it('Should get details of profile', () => {
    const profession = professions[0];
    const profile = new Profile(profession);
    const expectedProfession = 'Doctor(MD)';
    assert.strictEqual(profile.details.profession, expectedProfession);
  });

  it('Should set defaults for the profile', () => {
    const profession = professions[0];
    const profile = new Profile(profession);
    profile.setDefaults();
    assert.strictEqual(profile.details.cash, 7700);
  });

  it('Should calculate the total income', () => {
    const profession = professions[0];
    const profile = new Profile(profession);
    const expectedTotalIncome = 13200;
    assert.strictEqual(profile.details.totalIncome, expectedTotalIncome);
  });

  it('Should calculate the total expenses', () => {
    const profession = professions[0];
    const profile = new Profile(profession);
    const expectedTotalExpenses = 9000;
    assert.strictEqual(profile.details.totalExpenses, expectedTotalExpenses);
  });

  it('Should calculate the cash flow', () => {
    const profession = professions[0];
    const profile = new Profile(profession);
    const expectedCF = 4200;
    assert.strictEqual(profile.details.cashFlow, expectedCF);
  });

  it('Should calculate the passive income', () => {
    const profession = professions[0];
    const profile = new Profile(profession);
    const expectedPassiveIncome = 0;
    assert.strictEqual(profile.details.passiveIncome, expectedPassiveIncome);
  });

  describe('addPay', () => {
    it('Should add cashflow amount to the cash', () => {
      const profession = professions[0];
      const profile = new Profile(profession);
      profile.setDefaults();
      profile.addPay();
      assert.strictEqual(profile.details.cash, 11900);
    });
  });

  describe('payExpenses', () => {
    it('Should not deduct amount from the cash', () => {
      const profession = professions[0];
      const profile = new Profile(profession);
      profile.setDefaults();
      assert.ok(profile.payExpenses() === 0);
      assert.strictEqual(profile.details.cash, 7700);
    });

    it('Should deduct amount from the cash', () => {
      const profession = professions[0];
      const profile = new Profile(profession);
      profile.setDefaults();
      profile.addPay();
      assert.ok(profile.payExpenses() === 1);
      assert.strictEqual(profile.details.cash, 2900);
    });
  });

  describe('donateCash', () => {
    it('Should not deduct amount from the cash', () => {
      const profession = professions[3];
      const profile = new Profile(profession);
      profile.setDefaults();
      profile.payExpenses();
      assert.ok(!profile.donateCash());
    });

    it('Should deduct amount from the cash', () => {
      const profession = professions[3];
      const profile = new Profile(profession);
      profile.setDefaults();
      assert.ok(profile.donateCash());
      assert.strictEqual(profile.details.cash, 3310);
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
      const profession = professions[1];
      const profile = new Profile(profession);
      profile.setDefaults();
      assert.ok(profile.addStocks(card, 10000) === 0);
    });

    it('Should add stocks to the player', () => {
      const profession = professions[1];
      const profile = new Profile(profession);
      profile.setDefaults();
      assert.ok(profile.addStocks(card, 100) === 1);
      assert.deepStrictEqual(profile.details.assets.stocks[0].count, 100);
    });
  });

  describe('deductDoodad', () => {
    it('Should deduct doodad amount from the cash', () => {
      const profession = professions[0];
      const profile = new Profile(profession);
      profile.setDefaults();
      profile.deductDoodad(100);
      assert.strictEqual(profile.details.cash, 7600);
    });
  });

  describe('addAsset', () => {
    it('Should not add asset if player has insufficient cash', () => {
      const profession = professions[0];
      const profile = new Profile(profession);
      profile.setDefaults();
      profile.deductDoodad(100);
      const status = profile.addAsset({ downPayment: 300000 });
      assert.ok(!status);
    });

    it('Should add card to assets', () => {
      const profession = professions[0];
      const profile = new Profile(profession);
      const card = { downPayment: 300 };
      profile.setDefaults();
      profile.deductDoodad(100);
      profile.addAsset(card);
      assert.deepStrictEqual(profile.details.assets.realEstates[0], card);
    });

    it('Should add card to liabilities', () => {
      const profession = professions[0];
      const profile = new Profile(profession);
      const card = { downPayment: 300 };
      profile.setDefaults();
      profile.deductDoodad(100);
      profile.addAsset(card);
      assert.deepStrictEqual(profile.details.liabilities.realEstates[0], card);
    });

    it('Should add card to income', () => {
      const profession = professions[0];
      const profile = new Profile(profession);
      const card = { downPayment: 300 };
      profile.setDefaults();
      profile.deductDoodad(100);
      profile.addAsset(card);
      assert.deepStrictEqual(profile.details.income.realEstates[0], card);
    });
  });

  describe('addLoan', () => {
    it('Should add amount to the cash', () => {
      const profile = new Profile(professions[1]);
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
      const profile = new Profile(professions[1]);
      profile.setDefaults();
      const expected = profile.details;
      const expectedCash = profile.details.cash;
      const expectedBankLoanPayment = profile.details.expenses.bankLoanPayment;
      profile.deductLoan(100);
      const actual = profile.details;

      assert.deepStrictEqual(actual.totalExpenses, expected.totalExpenses - 10);
      assert.deepStrictEqual(actual.cash, expectedCash - 100);
      assert.deepStrictEqual(actual.expenses.bankLoanPayment, expectedBankLoanPayment - 10);
    });

    it('Should not deduct amount when cash is not sufficient', () => {
      const profile = new Profile(professions[1]);
      profile.setDefaults();
      const actual = profile.deductLoan(1200);
      assert.strictEqual(actual, false);
    });
  });
});
