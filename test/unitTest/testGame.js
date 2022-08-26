const { Game } = require('../../src/models/game');
const { assert } = require('chai');
const professions = require('../../data/professions.json');
const { Dice } = require('../../src/models/die');
const { Player } = require('../../src/models/player');

describe('Game', () => {
  const expectedProfessions = JSON.stringify(professions);
  const colors = ['a', 'b', 'c', 'd', 'e', 'f'];

  it('Should give the current player', () => {
    const game = new Game(1234,
      [
        { username: 'p1', role: 'host' },
        { username: 'p2', role: 'guest' }
      ],
      new Dice(2, 6));

    assert.isOk(game.currentPlayer.username === 'p1');
  });

  it('Should change the turn to other player', () => {
    const game = new Game(1234,
      [
        new Player('p1', 'host', 'red', JSON.parse(expectedProfessions)[0]),
        new Player('p2', 'guest', 'red', JSON.parse(expectedProfessions)[1])
      ],
      new Dice(2, 6));
    game.changeTurn();
    assert.isOk(game.currentPlayer.username === 'p2');
  });

  it('Should change the rolled dice of current player to true', () => {
    const game = new Game(1234,
      [
        new Player('p1', 'host', 'red', JSON.parse(expectedProfessions)[0]),
        new Player('p2', 'guest', 'red', JSON.parse(expectedProfessions)[1])
      ],
      new Dice(2, 6));
    game.rollDice();

    assert.isOk(game.isRolledDice);
  });

  it('Should change the turn to other player in downsized', () => {
    const game = new Game(1234,
      [
        new Player('p1', 'host', 'red', JSON.parse(expectedProfessions)[0]),
        new Player('p2', 'guest', 'red', JSON.parse(expectedProfessions)[1])
      ],
      new Dice(2, 6));
    const card = {
      heading: 'New Card',
      symbol: 'a',
      family: 'downsized',
      type: 'downsized'
    };

    game.changeTurn();
    game.currentCard = card;
    game.payday('p1');
    game.downsized('p1');
    game.changeTurn();

    assert.isOk(game.currentPlayerName === 'p1');
  });

  it('Should return the player matching with user name', () => {
    const game = new Game(1234,
      [
        new Player('p1', 'host', 'red', JSON.parse(expectedProfessions)[0]),
        new Player('p2', 'guest', 'red', JSON.parse(expectedProfessions)[1])
      ],
      new Dice(2, 6));

    const actualPlayer = game.findPlayer('p2');
    assert.strictEqual(actualPlayer.username, 'p2');
  });

  it('Should allow player to play after skipping 2 of their chances', () => {
    const game = new Game(1234,
      [
        new Player('p1', 'host', 'red', JSON.parse(expectedProfessions)[0]),
        new Player('p2', 'guest', 'red', JSON.parse(expectedProfessions)[1])
      ],
      new Dice(2, 6));
    const card = {
      heading: 'New Card',
      symbol: 'a',
      family: 'downsized',
      type: 'downsized'
    };

    game.changeTurn();
    game.currentCard = card;
    game.payday('p1');
    game.downsized('p1');
    game.changeTurn();

    game.rollDice();
    game.changeTurn();

    game.rollDice();
    assert.strictEqual(game.currentPlayer.skippedTurns, 0);
  });

  it('Should allow player to roll again after buying lottery', () => {
    const game = new Game(1234,
      [
        new Player('p1', 'host', 'red', JSON.parse(expectedProfessions)[0]),
        new Player('p2', 'guest', 'red', JSON.parse(expectedProfessions)[1])
      ],
      new Dice(2, 6));

    const card = {
      heading: 'New Card',
      symbol: 'lottery',
      family: 'deal',
      type: 'lottery',
      lottery: 'money',
      success: [4, 5, 6],
      outcome: {
        success: 10000,
        failure: -5000,
      }
    };

    game.changeTurn();
    game.currentCard = card;
    game.reRollDice('p2');

    assert.isOk(game.currentTurn.info.state);
  });

  it('Should set the notifications to given notifiers', () => {
    const game = new Game(1234,
      [
        new Player('p1', 'host', 'red', JSON.parse(expectedProfessions)[0]),
        new Player('p2', 'guest', 'red', JSON.parse(expectedProfessions)[1])
      ],
      new Dice(2, 6));
    const card = {
      heading: 'New Card',
      symbol: 'a',
      family: 'downsized',
      type: 'downsized'
    };

    game.addNotification('a');
    assert.isOk(game.state.notifications.length);
  });

  it('Should add log', () => {
    const player = new Player('p1', 'host', 'red', JSON.parse(expectedProfessions)[0]);

    const game = new Game(1234,
      [player, new Player('p2', 'guest', 'red', JSON.parse(expectedProfessions)[1])],
      new Dice(2, 6));

    game.addLog('p1', 'is red');
    assert.deepStrictEqual(
      game.state.logs,
      [{ username: 'p1', color: 'red', message: 'is red' }]
    );
  });

  it('Should get a deal card', () => {
    const game = new Game(1234,
      [
        new Player('p1', 'host', 'red', JSON.parse(expectedProfessions)[0]),
        new Player('p2', 'guest', 'red', JSON.parse(expectedProfessions)[1])
      ],
      new Dice(2, 6));

    game.rollDice();
    const card = game.getCard('small');
    assert.isOk(card);
  });

  it('Should get other than deal card', () => {
    const game = new Game(1234,
      [
        new Player('p1', 'host', 'red', JSON.parse(expectedProfessions)[0]),
        new Player('p2', 'guest', 'red', JSON.parse(expectedProfessions)[1])
      ],
      new Dice(2, 6));

    game.rollDice();
    const card = game.getCard();
    assert.isOk(card);
  });

  it('Should set notification', () => {
    const game = new Game(1234,
      [
        new Player('p1', 'host', 'red', JSON.parse(expectedProfessions)[0]),
        new Player('p2', 'guest', 'red', JSON.parse(expectedProfessions)[1])
      ],
      new Dice(2, 6));

    game.rollDice();
    game.setNotifications();
    assert.isOk(game.notifications);
  });

  describe('actions', () => {
    it('Should add payday amount', () => {
      const game = new Game(1234,
        [
          new Player('p1', 'host', 'red', JSON.parse(expectedProfessions)[0]),
          new Player('p2', 'guest', 'red', JSON.parse(expectedProfessions)[1])
        ],
        new Dice(2, 6));
      const card = {
        heading: 'New Card',
        symbol: 'a',
        family: 'payday',
        type: 'payday'
      };
      game.currentCard = card;

      assert.isOk(game.payday('p1'));
    });
  });

  describe('loan', () => {
    it('Should add loan amount to cash and player to be bankrupted', () => {
      const game = new Game(1234,
        [new Player('p1', 'host', 'red', JSON.parse(expectedProfessions)[0]), new Player('p2', 'guest', 'red', JSON.parse(expectedProfessions)[1])],
        new Dice(2, 6));

      const card = {
        heading: 'New Card',
        symbol: 'a',
        family: 'payday',
        type: 'payday'
      };

      game.currentCard = card;
      game.takeLoan('p1', 1000);
      const player = game.findPlayer('p1');
      assert.strictEqual(player.profile().cash, 1000);
      assert.isNotOk(player.profile().hasBankrupt);

    });

    it('Should remove loan amount to cash', () => {
      const game = new Game(1234,
        [new Player('p1', 'host', 'red', JSON.parse(expectedProfessions)[0]), new Player('p2', 'guest', 'red', JSON.parse(expectedProfessions)[1])],
        new Dice(2, 6));

      const card = {
        heading: 'New Card',
        symbol: 'a',
        family: 'payday',
        type: 'payday'
      };

      game.currentCard = card;
      game.takeLoan('p1', 1000);
      game.payLoan('p1', 1000);
      const player = game.findPlayer('p1');
      assert.strictEqual(player.profile().cash, 0);
    });
  });
});
