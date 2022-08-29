const professions = require('../../data/professions.json');
const { Turn } = require('../../src/models/turn.js');
const { Log } = require('../../src/models/log.js');
const { Player } = require('../../src/models/player.js');
const { assert } = require('chai');
const { Response, createResponses } = require('../../src/models/response.js');

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

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);
      turn.payday(player);

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

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.doodad(player);

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
        { family: 'doodad', status: 1, username: 'user' }
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

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.doodad(player);

      assert.isOk(!turn.info.state);
      assert.deepStrictEqual(log.getAllLogs(), []);
      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'doodad', status: 0, username: 'user' }
      );
    });

    it('Should escape doodad if conditional doodad is', () => {
      const log = new Log();
      const escaped = () => 2;
      const player = {
        username: 'user',
        color: 'c',
        profile: { cashFlow: 100 },
        doodad: escaped,
        payday: identity,
        buyRealEstate: identity
      };

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.doodad(player);

      assert.deepStrictEqual(log.getAllLogs(),
        [{
          color: 'c',
          message: 'escaped from doodad',
          username: 'user'
        }]
      );
      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'doodad', status: 2, username: 'user' }
      );
    });
  });

  describe('buyLottery', () => {
    const card = {
      heading: 'New Card',
      symbol: 'a',
      cost: 100,
      family: 'deal',
      type: 'lottery'
    };

    it('Should deduct the lottery cost', () => {
      const log = new Log();
      const player = {
        username: 'user',
        color: 'c',
        profile: { cashFlow: 100, totalIncome: 100 },
        doodad: identity,
        payday: identity,
        buyRealEstate: identity,
        buyLottery: successful
      };

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.buyLottery(player);

      assert.isNotOk(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [
          {
            username: 'user',
            color: 'c',
            message: `bought ${card.type} for $${card.cost}`
          }
        ]
      );
      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'deal', status: 1, username: 'user' }
      );
    });

    it('Should not be able to afford the lottery', () => {
      const log = new Log();
      const player = {
        username: 'user',
        color: 'c',
        profile: { cashFlow: 100 },
        doodad: identity,
        payday: identity,
        buyRealEstate: identity,
        buyLottery: failure,
      };

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.buyLottery(player);

      assert.isNotOk(turn.info.state);
      assert.deepStrictEqual(log.getAllLogs(), []);
      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'deal', status: 0, username: 'user' }
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

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.buyRealEstate(player);

      assert.isOk(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [{ username: 'user', color: 'c', message: `bought ${card.symbol}` }]
      );

      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'deal', status: 1, username: 'user' }
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

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.buyRealEstate(player);

      assert.isOk(!turn.info.state);
      assert.deepStrictEqual(log.getAllLogs(), []);
      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'deal', status: 0, username: 'user' }
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
        dualDiceCount: 0,
        incrementDualDiceCount: () => {
          player.dualDiceCount += 3;
        },
        details: {
          profile: { cashFlow: 100, totalIncome: 100 }
        },
        doodad: identity,
        payday: identity,
        buyRealEstate: identity,
        charity: successful
      };

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.charity(player);

      assert.isOk(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [
          { username: 'user', color: 'c', message: 'donated $10 to charity' }
        ]
      );

      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'charity', status: 1, username: 'user' }
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

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.charity(player);

      assert.isOk(!turn.info.state);
      assert.deepStrictEqual(log.getAllLogs(), []);
      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'charity', status: 0, username: 'user' }
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

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.buyStocks(player, 1);

      assert.isOk(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [{ username: 'user', color: 'c', message: 'bought 1 a stocks' }]
      );

      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'deal', status: 1, username: 'user' }
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

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.buyStocks(player, 1);

      assert.isOk(!turn.info.state);
      assert.deepStrictEqual(log.getAllLogs(), []);
      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'deal', status: 0, username: 'user' }
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

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.baby(player);

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

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.baby(player);

      assert.isOk(turn.info.state);
      assert.deepStrictEqual(log.getAllLogs(), [
        { username: 'user', color: 'c', message: 'already have 3 babies' }
      ]);
    });
  });

  describe('skip', () => {
    it('Should invoke the players skip', () => {
      const log = new Log();

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.skip(player);
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
        skippedTurns: 0,
        initializeSkippedTurns: () => {
          player.skippedTurns = 2;
        },
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

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.downsized(player);

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
        { family: 'downsized', status: 1, username: 'user' }
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

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.downsized(player);

      assert.isNotOk(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(), []
      );

      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'downsized', status: 0, username: 'user' }
      );
    });
  });
  describe('lottery', () => {
    const card = {
      heading: 'New Card',
      symbol: 'a',
      type: 'lottery',
      lottery: 'stock',
      success: [
        1,
        2,
        3
      ]
    };
    const professionStr = JSON.stringify(professions[0]);

    it('Should split stocks of the player', () => {
      const log = new Log();
      const profession = JSON.parse(professionStr);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      player.buyStocks(card, 10);

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.lottery([player], player, 1);
      assert.deepStrictEqual(player.profile().assets.stocks[0].count, 20);
    });
    it('Should reverse split stocks of the player', () => {
      const log = new Log();
      const profession = JSON.parse(professionStr);
      const player = new Player('p3', 'guest', 'red', profession);
      player.setDefaults();
      player.buyStocks(card, 10);

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.lottery([player], player, 4);
      assert.deepStrictEqual(player.profile().assets.stocks[0].count, 5);
    });
  });

  describe('property Damages', () => {
    const card = {
      cost: 400,
      type: 'damage'
    };

    it('Should add realEstate message on successful of paying damage', () => {
      const log = new Log();
      const player = {
        skippedTurns: 0,
        payDamages: successful,
        username: 'user',
        color: 'c',
        details: {
          profile: {
            assets: {
              realEstates: [{
                heading: 'New Card',
              }]
            }
          }
        },
        hasStock: identity,
        deactivateReroll: identity
      };
      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);
      turn.propertyDamage(player);
      assert.deepStrictEqual(
        turn.info.transaction, { family: 'market', status: 1, username: 'user' }
      );
      assert.isOk(turn.info.state);
    });
  });

  it('Should add no realEstate message on failure of paying damage', () => {
    const log = new Log();
    const player = {
      skippedTurns: 0,
      payDamages: failure,
      username: 'user',
      color: 'c',
      details: {
        profile: {
          assets: {
            realEstates: [{
              heading: 'New Card',
            }]
          }
        }
      },
      hasStock: identity,
      deactivateReroll: identity
    };

    const response = new Response(createResponses([player]));
    const turn = new Turn(card, player, log, response);

    turn.propertyDamage(player);
    assert.deepStrictEqual(
      turn.info.transaction, { family: 'market', status: 0, username: 'user' }
    );
    assert.isOk(turn.info.state);
  });

  
  it('Should return if player doesn\'t have enough cash', () => {
    const log = new Log();
    const player = {
      skippedTurns: 0,
      payDamages: () => 6,
      username: 'user',
      color: 'c',
      details: {
        profile: {
          assets: {
            realEstates: [{
              heading: 'New Card',
            }]
          }
        }
      },
      hasStock: identity,
      deactivateReroll: identity
    };

    const response = new Response(createResponses([player]));
    const turn = new Turn(card, player, log, response);

    turn.propertyDamage(player);
    assert.deepStrictEqual(
      turn.info.transaction, { family: 'market', status: 6, username: 'user' }
    );
  });

  describe('Gold coins', () => {

    it('Should set transaction as successful when sold gold coins', () => {
      const card = {};
      const log = new Log();
      const player = {
        username: 'user',
        color: 'c',
        profile: { cashFlow: 100, totalIncome: 100 }
      };

      const response = new Response(createResponses([player]));
      const turn = new Turn(card, player, log, response);

      turn.sellGold(player, 1);

      assert.isOk(turn.info.state);
      assert.deepStrictEqual(
        log.getAllLogs(),
        [{ username: 'user', color: 'c', message: 'sold gold coins of count 1' }]
      );

      assert.deepStrictEqual(
        turn.info.transaction,
        { family: 'market', status: 5, username: 'user' }
      );
    });
  });
});
