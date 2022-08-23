const { Game } = require('../../src/models/game');
const { assert } = require('chai');
const professions = require('../../data/professions.json');

describe('Game', () => {
  const expectedProfessions = JSON.stringify(professions);
  const colors = ['a', 'b', 'c', 'd', 'e', 'f'];

  it('Should add a player if not joined the game', () => {
    const game = new Game(1234, colors, JSON.parse(expectedProfessions));
    game.addGuest('newPlayer');
    const allPlayers = game.allPlayerDetails;
    assert.strictEqual(allPlayers.length, 1);
  });

  it('Should not add a player if joined the game', () => {
    const game = new Game(1234, colors, JSON.parse(expectedProfessions));
    game.addGuest('newPlayer');
    game.addGuest('newPlayer');
    const allPlayers = game.allPlayerDetails;
    assert.strictEqual(allPlayers.length, 1);
  });

  it('Should remove a player if already exists', () => {
    const game = new Game(1234, colors, JSON.parse(expectedProfessions));
    game.addGuest('newPlayer');
    game.removePlayer('newPlayer');
    const allPlayers = game.allPlayerDetails;
    assert.strictEqual(allPlayers.length, 0);
  });

  it('Should validate the given gameID', () => {
    const game = new Game(1234, 1234, colors, JSON.parse(expectedProfessions));
    assert.isOk(game.isValidGameID(1234));
  });

  it('Should give true if the lobby is full ', () => {
    const game = new Game(1234, colors, JSON.parse(expectedProfessions));
    game.addGuest('p1');
    game.addGuest('p2');
    game.addGuest('p3');
    game.addGuest('p4');
    game.addGuest('p5');
    game.addGuest('p6');
    assert.isOk(game.isLobbyFull());
  });

  it('Should give false if the lobby is not full ', () => {
    const game = new Game(1234, colors, JSON.parse(expectedProfessions));
    game.addGuest('p1');
    assert.isNotOk(game.isLobbyFull());
  });

  it('Should give the current player', () => {
    const game = new Game(1234, colors, JSON.parse(expectedProfessions));
    game.addGuest('p1');
    game.addGuest('p2');
    game.start();
    assert.isOk(game.currentPlayer.username === 'p1');
  });

  it('Should change the turn to other player', () => {
    const game = new Game(1234, colors, JSON.parse(expectedProfessions));
    game.addGuest('p1');
    game.addGuest('p2');
    game.start();
    assert.isOk(game.state.currentPlayer.username === 'p1');
  });

  it('Should change the turn to other player', () => {
    const game = new Game(1234, colors, JSON.parse(expectedProfessions));
    game.assignHost('p1');
    game.addGuest('p2');
    game.start();
    game.changeTurn();
    assert.isOk(game.currentPlayer.username === 'p2');
  });

  it('Should change the rolled dice of current player to true', () => {
    const game = new Game(1234, colors, JSON.parse(expectedProfessions));
    game.assignHost('p1');
    game.addGuest('p2');
    game.start();
    game.rollDice();

    assert.isOk(game.isRolledDice);
  });

  it('Should change the turn to other player in downsized', () => {
    const selectedProfessions = JSON.parse(expectedProfessions);
    const game = new Game(1234, colors, selectedProfessions);
    const card = {
      heading: 'New Card',
      symbol: 'a',
      family: 'downsized',
      type: 'downsized'
    };

    game.assignHost('p1');
    game.addGuest('p2');
    game.start();

    game.changeTurn();
    game.currentCard = card;
    game.payday();
    game.downsized();
    game.changeTurn();

    assert.isOk(game.currentPlayerName === 'p1');
  });

  it('Should return the player matching with user name', () => {
    const game = new Game(1234, colors, JSON.parse(expectedProfessions));
    game.assignHost('p1');
    game.addGuest('p2');

    const actualPlayer = game.getPlayer('p2');
    assert.strictEqual(actualPlayer.username, 'p2');
  });

  it('Should allow player to play after skipping 2 of their chances', () => {
    const selectedProfessions = JSON.parse(expectedProfessions);
    const game = new Game(1234, colors, selectedProfessions);
    const card = {
      heading: 'New Card',
      symbol: 'a',
      family: 'downsized',
      type: 'downsized'
    };

    game.assignHost('p1');
    game.addGuest('p2');
    game.start();

    game.changeTurn();
    game.currentCard = card;
    game.payday();
    game.downsized();
    game.changeTurn();

    game.rollDice();
    game.changeTurn();

    game.rollDice();
    assert.strictEqual(game.currentPlayer.skippedTurns, 0);
  });

  it('Should allow player to roll again after buying lottery', () => {
    const selectedProfessions = JSON.parse(expectedProfessions);
    const game = new Game(1234, colors, selectedProfessions);
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

    game.assignHost('p1');
    game.addGuest('p2');
    game.start();

    game.changeTurn();
    game.currentCard = card;
    game.reRollDice();

    assert.isOk(game.currentTurn.info.state);
  });

  it('Should set the notifications to given notifiers', () => {
    const selectedProfessions = JSON.parse(expectedProfessions);
    const game = new Game(1234, colors, selectedProfessions);
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
    const player = {
      username: 'p1',
      color: 'red'
    };
    const game = new Game(1234, colors, JSON.parse(expectedProfessions));

    game.addLog(player, 'is red');
    assert.deepStrictEqual(
      game.state.logs,
      [{ username: 'p1', color: 'red', message: 'is red' }]
    );
  });

  it('Should get a deal card', () => {
    const game = new Game(1234, colors, JSON.parse(expectedProfessions));

    game.assignHost('p1');
    game.addGuest('p2');
    game.start();

    game.rollDice();
    const card = game.getCard('small');
    assert.isOk(card);
  });

  it('Should get other than deal card', () => {
    const game = new Game(1234, colors, JSON.parse(expectedProfessions));

    game.assignHost('p1');
    game.addGuest('p2');
    game.start();

    game.rollDice();
    const card = game.getCard();
    assert.isOk(card);
  });

  it('Should set notification', () => {
    const game = new Game(1234, colors, JSON.parse(expectedProfessions));

    game.assignHost('p1');
    game.addGuest('p2');
    game.start();

    game.rollDice();
    game.setNotifications();
    assert.isOk(game.notifications);
  });

  describe('actions', () => {
    it('Should add payday amount', () => {
      const game = new Game(1234, colors, JSON.parse(expectedProfessions));
      const card = {
        heading: 'New Card',
        symbol: 'a',
        family: 'payday',
        type: 'payday'
      };

      game.assignHost('p1');
      game.addGuest('p2');
      game.start();
      game.currentCard = card;

      assert.isOk(game.payday());
    });
  });
});
