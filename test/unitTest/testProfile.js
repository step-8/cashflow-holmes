const { Profile } = require('../../src/models/profile');
const professions = require('../../data/professions.json');
const assert = require('assert');

describe('Profile', () => {
  const profession = professions[0];
  const profile = new Profile(profession);
  const expectedProfession = 'Doctor(MD)';
  const expectedTotalIncome = 13200;
  const expectedTotalExpenses = 9000;
  const expectedCF = 4200;
  const expectedPassiveIncome = 0;

  it('Should get details of profile', () => {
    assert.strictEqual(profile.details.profession, expectedProfession);
  });

  it('Should set defaults for the profile', () => {
    profile.setDefaults();
    assert.strictEqual(profile.details.cash, 7700);
  });

  it('Should calculate the total income', () => {
    assert.strictEqual(profile.details.totalIncome, expectedTotalIncome);
  });

  it('Should calculate the total expenses', () => {
    assert.strictEqual(profile.details.totalExpenses, expectedTotalExpenses);
  });

  it('Should calculate the cash flow', () => {
    assert.strictEqual(profile.details.cashFlow, expectedCF);
  });

  it('Should calculate the passive income', () => {
    assert.strictEqual(profile.details.passiveIncome, expectedPassiveIncome);
  });

  describe('addPay', () => {
    it('Should add cashflow amount to the cash', () => {
      const profile = new Profile(profession);
      profile.setDefaults();
      profile.addPay();
      assert.strictEqual(profile.details.cash, 11900);
    });
  });

  describe('deductDoodad', () => {
    it('Should deduct doodad amount from the cash', () => {
      const profile = new Profile(profession);
      profile.setDefaults();
      profile.deductDoodad(100);
      assert.strictEqual(profile.details.cash, 7600);
    });
  });

  describe('deductDoodad', () => {
    it('Should deduct doodad amount from the cash', () => {
      const profile = new Profile(profession);
      profile.setDefaults();
      profile.deductDoodad(100);
      assert.strictEqual(profile.details.cash, 7600);
    });
  });

  describe('addAsset', () => {
    it('Should not add asset if player has insufficient cash', () => {
      const profile = new Profile(profession);
      profile.setDefaults();
      profile.deductDoodad(100);
      const status = profile.addAsset({ downPayment: 300000 });
      assert.ok(!status);
    });

    it('Should add card to assets', () => {
      const profile = new Profile(profession);
      const card = { downPayment: 300 };
      profile.setDefaults();
      profile.deductDoodad(100);
      profile.addAsset(card);
      assert.deepStrictEqual(profile.details.assets.realEstates[0], card);
    });

    it('Should add card to liabilities', () => {
      const profile = new Profile(profession);
      const card = { downPayment: 300 };
      profile.setDefaults();
      profile.deductDoodad(100);
      profile.addAsset(card);
      assert.deepStrictEqual(profile.details.liabilities.realEstates[0], card);
    });

    it('Should add card to income', () => {
      const profile = new Profile(profession);
      const card = { downPayment: 300 };
      profile.setDefaults();
      profile.deductDoodad(100);
      profile.addAsset(card);
      assert.deepStrictEqual(profile.details.income.realEstates[0], card);
    });
  });
});
