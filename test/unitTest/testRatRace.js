const { RatRace } = require('../../src/models/ratRace');
const deck = require('../../data/cards.json');
const assert = require('assert');

describe('RatRace', () => {
  it('Should give card type based on given position', () => {
    const ratRace = new RatRace(deck);
    const cardType = ratRace.getCardType(2);
    assert.strictEqual(cardType, 'doodad');
  });

  it('Should give undefined on invalid tile position', () => {
    const ratRace = new RatRace(deck);
    const cardType = ratRace.getCardType(30);
    assert.ok(!cardType);
  });

  it('Should give card on valid type', () => {
    const ratRace = new RatRace(deck);
    const card = ratRace.getCard('market');
    assert.ok(card);
  });

  it('Should give undefined on invalid type', () => {
    const ratRace = new RatRace(deck);
    const card = ratRace.getCard('deal');
    assert.ok(!card);
  });
});
