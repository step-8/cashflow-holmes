const { Turn } = require('../../src/models/turn.js');
const { Log } = require('../../src/models/log.js');
const assert = require('assert');

describe('Turn', () => {
  const identity = (__) => assert.ok(true);
  const log = new Log();
  const player = {
    details: { username: 'user', color: 'c', profile: { cashFlow: 100 } },
    doodad: identity,
    payday: identity,
    buyRealEstate: identity
  };
  const card = {
    heading: 'New Card',
    symbol: 'a',
    cost: 100
  };

  it('Should update the card', () => {
    const turn = new Turn(card, player, log);
    turn.updateCard('c2');
    assert.strictEqual(turn.info.card, 'c2');
  });

  it('Should update the player', () => {
    const turn = new Turn(card, player, log);
    turn.updatePlayer('p2');
    assert.strictEqual(turn.info.player, 'p2');
  });

  describe('payday', () => {
    it('Should invoke the players payday', () => {
      const log = new Log();
      const turn = new Turn(card, player, log);
      turn.payday();
      assert.ok(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [{ username: 'user', color: 'c', message: 'received pay of 100' }]
      );
    });
  });

  describe('doodad', () => {
    it('Should invoke the players doodad', () => {
      const log = new Log();
      const turn = new Turn(card, player, log);
      turn.doodad();
      assert.ok(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [{ username: 'user', color: 'c', message: `payed ${card.cost} on ${card.heading}` }]
      );
    });
  });

  describe('buyRealEstate', () => {
    it('Should invoke the players buyRealEstate', () => {
      const log = new Log();
      const turn = new Turn(card, player, log);
      turn.buyRealEstate();
      assert.ok(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [{ username: 'user', color: 'c', message: `bought ${card.symbol}` }]
      );
    });
  });

  describe('skip', () => {
    it('Should invoke the players skip', () => {
      const log = new Log();
      const turn = new Turn(card, player, log);
      turn.skip();
      assert.ok(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [{ username: 'user', color: 'c', message: `skipped ${card.symbol}` }]
      );
    });
  });

});

