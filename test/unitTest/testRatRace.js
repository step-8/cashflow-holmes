const { RatRace } = require('../../src/models/ratRace');
const deck = require('../../data/cards.json');
const assert = require('assert');

describe('RatRace', () => {
  describe('getCardType', () => {
    it('Should give card type based on given position', () => {
      const ratRace = new RatRace(deck);
      const cardType = ratRace.getCardType(2);
      assert.strictEqual(cardType, 'doodad');
    });

    it('Should not give card type on invalid tile position', () => {
      const ratRace = new RatRace(deck);
      const cardType = ratRace.getCardType(30);
      assert.ok(!cardType);
    });
  });

  describe('getCard', () => {
    it('Should give card on valid type', () => {
      const ratRace = new RatRace(deck);
      const card = ratRace.getCard('market');
      assert.ok(card);
    });

    it('Should not give card on invalid type', () => {
      const ratRace = new RatRace(deck);
      const card = ratRace.getCard('deal');
      assert.ok(!card);
    });
  });

  describe('getNotifications', () => {
    it('Should give payday card on valid notification payday card', () => {
      const ratRace = new RatRace(deck);
      const notifications = ratRace.getNotifications('payday');
      assert.strictEqual(notifications[0].type, 'payday');
    });

    it('Should give no cards on invalid notification card', () => {
      const ratRace = new RatRace(deck);
      const notifications = ratRace.getNotifications('');
      assert.deepStrictEqual(notifications, []);
    });
  });

  describe('pickCard', () => {
    it('Should give a card of given valid type', () => {
      const ratRace = new RatRace(deck);
      const card = ratRace.pickCard('doodad');
      assert.deepStrictEqual(card.type, 'doodad');
    });

    it('Should not give a card of given invalid type', () => {
      const ratRace = new RatRace(deck);
      const card = ratRace.pickCard('payday');
      assert.deepStrictEqual(card, {});
    });
  });
});
