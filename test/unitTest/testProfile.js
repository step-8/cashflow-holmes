const { Profile } = require('../../src/models/profile');
const professions = require('../../data/professions.json');
const assert = require('assert');

describe('Profile', () => {
  const profession = professions[0];

  it('Should get details of profile', () => {
    const profile = new Profile(profession);
    const details = profile.details;
    const expectedProfession = 'Doctor(MD)';
    const expectedTotalIncome = 13200;
    const expectedTotalExpenses = 9000;
    const expectedCF = 4200;
    const expectedCash = 7700;

    assert.strictEqual(details.profession, expectedProfession);
    assert.strictEqual(details.totalIncome, expectedTotalIncome);
    assert.strictEqual(details.totalExpenses, expectedTotalExpenses);
    assert.strictEqual(details.cashFlow, expectedCF);
    assert.strictEqual(details.cash, expectedCash);
  });
});
