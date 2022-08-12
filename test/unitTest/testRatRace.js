const { Ratrace } = require('../../src/models/ratRace');
const assert = require('assert');

describe('RatRace', () => {
  it('Should give card type based on given position', () => {
    const ratRace = new Ratrace();
    const cardType = ratRace.getCardType(2);
    assert.strictEqual(cardType, 'doodad');
  });

  it('Should give undefined on invalid tile position', () => {
    const ratRace = new Ratrace();
    const cardType = ratRace.getCardType(30);
    assert.ok(!cardType);
  });
});
