const { RatRace } = require('../../src/models/ratRace');
const deck = require('../../data/cards.json');
const { assert } = require('chai');

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
      assert.isOk(!cardType);
    });
  });

  describe('getCard', () => {
    it('Should give card on valid type', () => {
      const ratRace = new RatRace(deck);
      const player = { lastPosition: 0, currentPosition: 1 };
      const card = ratRace.getCard('market', player);
      assert.isOk(card);
    });

    it('Should not give card on invalid type', () => {
      const ratRace = new RatRace(deck);
      const player = { lastPosition: 0, currentPosition: 1 };
      const card = ratRace.getCard('deal', player);
      assert.isOk(!card);
    });
  });

  describe('getNotifications', () => {
    it('Should give payday card on valid notification payday card', () => {
      const ratRace = new RatRace(deck);
      const deals = ['smallDeal', 'bigDeal'];
      const player = { lastPosition: 5, currentPosition: 7 };
      const notifications = ratRace.getNotifications('payday', player);
      assert.strictEqual(notifications[0].type, 'payday');
    });

    it('Should give no cards on invalid notification card', () => {
      const ratRace = new RatRace(deck);
      const deals = ['smallDeal', 'bigDeal'];
      const player = { lastPosition: 0, currentPosition: 1 };
      const notifications = ratRace.getNotifications('', player);
      assert.deepStrictEqual(notifications, []);
    });

    it('Should give no cards on current card is a deal', () => {
      const ratRace = new RatRace(deck);
      const deals = ['smallDeal', 'bigDeal'];
      const player = { lastPosition: 0, currentPosition: 1 };
      const notifications = ratRace.getNotifications('bigDeal', deals, player);
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
