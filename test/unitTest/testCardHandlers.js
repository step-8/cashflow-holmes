const { assert } = require('chai');
const { acceptCard, buyDeal } = require('../../src/handlers/cardHandlers.js');

describe('accept card', () => {
  const game = {
    payday: () => assert.isOk(1),
    downsized: () => assert.isOk(1),
    baby: () => assert.isOk(1),
    notifications: ['a', 'b'],
    removeTopNotification: () => game.notifications.shift()
  };

  it('Should invoke payday in game and remove notification', () => {
    acceptCard(game, 'payday');
    assert.deepEqual(game.notifications, ['b']);
  });

  it('Should invoke downsized event in game', () => {
    acceptCard(game, 'downsized');
  });

  it('Should invoke baby events in game', () => {
    acceptCard(game, 'baby');
  });
});

describe('buy deal', () => {
  const game = {
    buyRealEstate: () => assert.isOk(1),
    buyStocks: () => assert.isOk(1),
    skip: () => assert.isOk(1),
  };
  const count = 0;

  it('Should invoke buyRealEstate in game ', () => {
    buyDeal(game, 'realEstate', count);
  });

  it('Should invoke buyStocks event in game', () => {
    buyDeal(game, 'stock', count);
  });

  it('Should invoke skip event in game if no event matched', () => {
    buyDeal(game, '', count);
  });
});
