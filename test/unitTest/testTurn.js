const { Turn } = require('../../src/models/turn.js');
const { Log } = require('../../src/models/log.js');
const { assert } = require('chai');

describe('Turn', () => {
  const identity = (__) => assert.isOk(true);
  const successful = () => 1;
  const failure = () => 0;
  const log = new Log();
  const player = {
    username: 'user', color: 'c', profile: { cashFlow: 100 },
    doodad: identity,
    payday: identity,
    buyRealEstate: successful
  };
  const card = {
    heading: 'New Card',
    symbol: 'a',
    cost: 100,
    family: 'deal'
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
      const player = {
        username: 'user',
        color: 'c',
        details: {
          profile: { cashFlow: 100, totalIncome: 100 }
        },
        doodad: identity,
        payday: successful,
        buyRealEstate: identity
      };
      const turn = new Turn(card, player, log);
      turn.payday();
      assert.isOk(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [{ username: 'user', color: 'c', message: 'received pay of $100' }]
      );
    });
  });

  describe('doodad', () => {
    const card = {
      heading: 'New Card',
      symbol: 'a',
      cost: 100,
      family: 'doodad'
    };

    it('Should deduct the players doodad cost', () => {
      const log = new Log();
      const player = {
        username: 'user',
        color: 'c',
        profile: { cashFlow: 100, totalIncome: 100 },
        doodad: successful,
        payday: identity,
        buyRealEstate: identity
      };

      const turn = new Turn(card, player, log);
      turn.doodad();

      assert.isOk(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [
          {
            username: 'user',
            color: 'c',
            message: `payed $${card.cost} on ${card.heading}`
          }
        ]
      );
      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'doodad', status: 1 }
      );
    });

    it('Should not be able to afford the doodad', () => {
      const log = new Log();
      const player = {
        username: 'user',
        color: 'c',
        profile: { cashFlow: 100 },
        doodad: failure,
        payday: identity,
        buyRealEstate: identity
      };

      const turn = new Turn(card, player, log);
      turn.doodad();

      assert.isOk(!turn.info.state);
      assert.deepStrictEqual(log.getAllLogs(), []);
      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'doodad', status: 0 }
      );
    });
  });

  describe('buyRealEstate', () => {
    it('Should buy buyRealEstate set transaction as successful', () => {
      const log = new Log();
      const player = {
        username: 'user',
        color: 'c',
        profile: { cashFlow: 100 },
        doodad: identity,
        payday: identity,
        buyRealEstate: successful
      };

      const turn = new Turn(card, player, log);
      turn.buyRealEstate();

      assert.isOk(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [{ username: 'user', color: 'c', message: `bought ${card.symbol}` }]
      );

      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'deal', status: 1 }
      );
    });

    it('Should not buy buyRealEstate set transaction as failure', () => {
      const log = new Log();
      const player = {
        username: 'user',
        color: 'c',
        profile: { cashFlow: 100 },
        doodad: identity,
        payday: identity,
        buyRealEstate: failure
      };

      const turn = new Turn(card, player, log);
      turn.buyRealEstate();

      assert.isOk(!turn.info.state);
      assert.deepStrictEqual(log.getAllLogs(), []);
      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'deal', status: 0 }
      );
    });
  });

  describe('charity', () => {
    const card = {
      heading: 'New Card',
      symbol: 'a',
      family: 'charity'
    };

    it('Should set transaction as successful when donated to charity', () => {
      const log = new Log();
      const player = {
        username: 'user',
        color: 'c',
        details: {
          profile: { cashFlow: 100, totalIncome: 100 }
        },
        doodad: identity,
        payday: identity,
        buyRealEstate: identity,
        charity: successful
      };

      const turn = new Turn(card, player, log);
      turn.charity();

      assert.isOk(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [
          { username: 'user', color: 'c', message: 'donated $10 to charity' }
        ]
      );

      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'charity', status: 1 }
      );
    });

    it('Should set transaction as failure when charity failed', () => {
      const log = new Log();
      const player = {
        username: 'user',
        color: 'c',
        details: {
          profile: { cashFlow: 100, totalIncome: 100 }
        },
        doodad: identity,
        payday: identity,
        buyRealEstate: identity,
        charity: failure
      };

      const turn = new Turn(card, player, log);
      turn.charity();

      assert.isOk(!turn.info.state);
      assert.deepStrictEqual(log.getAllLogs(), []);
      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'charity', status: 0 }
      );
    });
  });

  describe('stocks', () => {
    const card = {
      heading: 'New Card',
      symbol: 'a',
      family: 'deal',
      type: 'stock'
    };

    it('Should set transaction as successful when bought the stocks', () => {
      const log = new Log();
      const player = {
        username: 'user',
        color: 'c',
        profile: { cashFlow: 100, totalIncome: 100 },
        doodad: identity,
        payday: identity,
        buyRealEstate: identity,
        charity: identity,
        buyStocks: successful
      };

      const turn = new Turn(card, player, log);
      turn.buyStocks(1);

      assert.isOk(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [{ username: 'user', color: 'c', message: 'bought 1 a stocks' }]
      );

      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'deal', status: 1 }
      );
    });

    it('Should set transaction as failure when charity failed', () => {
      const log = new Log();
      const player = {
        username: 'user',
        color: 'c',
        profile: { cashFlow: 100, totalIncome: 100 },
        doodad: identity,
        payday: identity,
        buyRealEstate: identity,
        charity: identity,
        buyStocks: failure
      };

      const turn = new Turn(card, player, log);
      turn.buyStocks(1);

      assert.isOk(!turn.info.state);
      assert.deepStrictEqual(log.getAllLogs(), []);
      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'deal', status: 0 }
      );
    });
  });

  describe('baby', () => {
    const card = {
      heading: 'New Card',
      symbol: 'a',
      family: 'baby',
      type: 'baby'
    };

    it('Should add baby to the player', () => {
      const log = new Log();
      const player = {
        username: 'user',
        color: 'c',
        profile: { cashFlow: 100, totalIncome: 100, totalExpenses: 100 },
        baby: successful
      };

      const turn = new Turn(card, player, log);
      turn.baby();

      assert.isOk(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [
          { username: 'user', color: 'c', message: 'got new baby' }
        ]
      );
    });

    it('Should not add baby when there are 3 babies', () => {
      const log = new Log();
      const player = {
        username: 'user',
        color: 'c',
        profile: { cashFlow: 100, totalIncome: 100, totalExpenses: 100 },
        baby: failure
      };

      const turn = new Turn(card, player, log);
      turn.baby();

      assert.isOk(turn.info.state);
      assert.deepStrictEqual(log.getAllLogs(), [
        { username: 'user', color: 'c', message: 'already have 3 babies' }
      ]);
    });
  });

  describe('skip', () => {
    it('Should invoke the players skip', () => {
      const log = new Log();
      const turn = new Turn(card, player, log);
      turn.skip();
      assert.isOk(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [{ username: 'user', color: 'c', message: `skipped ${card.symbol}` }]
      );
    });
  });

  describe('downsized', () => {
    const card = {
      heading: 'New Card',
      symbol: 'a',
      family: 'downsized',
      type: 'downsized'
    };

    it('Should deduct expenses from player\'s cash', () => {
      const log = new Log();
      const player = {
        username: 'user',
        color: 'c',
        details: {
          profile: { cashFlow: 100, totalIncome: 100, totalExpenses: 100 }
        },
        doodad: identity,
        payday: identity,
        buyRealEstate: identity,
        charity: identity,
        downsized: successful
      };

      const turn = new Turn(card, player, log);
      turn.downsized();

      assert.isOk(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [
          { username: 'user', color: 'c', message: 'is downsized' },
          { username: 'user', color: 'c', message: 'paid expenses $100' }
        ]
      );

      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'downsized', status: 1 }
      );
    });

    it('Should not log the downsized messages', () => {
      const log = new Log();
      const player = {
        username: 'user', color: 'c',
        details: {
          profile: { cashFlow: 100, totalIncome: 100, totalExpenses: 1000 }
        },
        doodad: identity,
        payday: identity,
        buyRealEstate: identity,
        charity: identity,
        downsized: failure
      };

      const turn = new Turn(card, player, log);
      turn.downsized();

      assert.isNotOk(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(), []
      );

      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'downsized', status: 0 }
      );
    });
  });
});
