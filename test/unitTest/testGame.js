const { Game } = require('../../src/models/game');
const assert = require('assert');
const professions = require('../../data/professions.json');

describe('Game', () => {
  const colors = ['a', 'b', 'c', 'd', 'e', 'f'];
  const game = new Game(colors, professions);

  it('Should assign a game id', () => {
    const id = 12345;
    game.assignGameID(id);
    const gameState = game.state;
    assert.strictEqual(gameState.gameID, id);
  });

  it('Should add a player if not joined the game', () => {
    game.addGuest('newPlayer');
    const allPlayers = game.allPlayerDetails;
    assert.strictEqual(allPlayers.length, 1);
  });

  it('Should not add a player if joined the game', () => {
    const game = new Game(colors, professions);
    game.addGuest('newPlayer');
    game.addGuest('newPlayer');
    const allPlayers = game.allPlayerDetails;
    assert.strictEqual(allPlayers.length, 1);
  });

  it('Should remove a player if already exists', () => {
    const game = new Game(colors, professions);
    game.addGuest('newPlayer');
    game.removePlayer('newPlayer');
    const allPlayers = game.allPlayerDetails;
    assert.strictEqual(allPlayers.length, 0);
  });

  it('Should validate the given gameID', () => {
    const game = new Game(colors, professions);
    game.assignGameID(1234);
    assert.ok(game.isValidGameID(1234));
  });

  it('Should give true if the lobby is full ', () => {
    const game = new Game(colors, professions);
    game.assignGameID(1234);
    game.addGuest('p1');
    game.addGuest('p2');
    game.addGuest('p3');
    game.addGuest('p4');
    game.addGuest('p5');
    game.addGuest('p6');
    assert.ok(game.isLobbyFull());
  });

  it('Should give false if the lobby is not full ', () => {
    const game = new Game(colors, professions);
    game.assignGameID(1234);
    game.addGuest('p1');
    assert.ok(!game.isLobbyFull());
  });

  it('Should give the current player', () => {
    const game = new Game(colors, professions);
    game.assignGameID(1234);
    game.addGuest('p1');
    game.addGuest('p2');
    game.start();
    assert.ok(game.state.currentPlayer.username === 'p1');
  });

  it('Should change the turn to other player', () => {
    const game = new Game(colors, professions);
    game.assignGameID(1234);
    game.assignHost('p1');
    game.addGuest('p2');
    game.start();
    game.changeTurn();
    assert.ok(game.state.currentPlayer.username === 'p2');
  });

  it('Should change the rolled dice of current player to true', () => {
    const game = new Game(colors, professions);
    game.assignGameID(1234);
    game.assignHost('p1');
    game.addGuest('p2');
    game.start();
    game.rollDice();

    assert.ok(game.state.currentPlayer.isRolledDice);
  });

  it('Should change the turn to other player in downsized', () => {
    const selectedProfessions = [professions[0], professions[1]];
    const game = new Game(colors, selectedProfessions);
    const card = {
      heading: 'New Card',
      symbol: 'a',
      family: 'downsized',
      type: 'downsized'
    };

    game.assignGameID(1234);
    game.assignHost('p1');
    game.addGuest('p2');
    game.start();
    game.changeTurn();
    game.currentCard = card;
    game.currentTurn.payday();
    game.currentTurn.downsized();
    game.changeTurn();
    assert.ok(game.state.currentPlayer.username === 'p1');
  });

  it('Should return the player matching with user name', () => {
    const game = new Game(colors, professions);
    game.assignGameID(1234);
    game.assignHost('p1');
    game.addGuest('p2');

    const actualPlayer = game.getPlayer('p2');
    assert.strictEqual(actualPlayer.details.username, 'p2');
  });

  it('Should initialize the player skip turns value to 2', () => {
    const selectedProfessions = [professions[0], professions[1]];
    const game = new Game(colors, selectedProfessions);
    const card = {
      heading: 'New Card',
      symbol: 'a',
      family: 'downsized',
      type: 'downsized'
    };

    game.assignGameID(1234);
    game.assignHost('p1');
    game.addGuest('p2');
    game.start();
    game.changeTurn();
    game.currentCard = card;
    game.currentTurn.payday();
    game.currentTurn.downsized();
    assert.ok(game.state.currentPlayer.skippedTurns === 2);
  });

  it('Should allow player to play after skipping 2 of their chances', () => {
    const selectedProfessions = [professions[0], professions[1]];
    const game = new Game(colors, selectedProfessions);
    const card = {
      heading: 'New Card',
      symbol: 'a',
      family: 'downsized',
      type: 'downsized'
    };

    game.assignGameID(1234);
    game.assignHost('p1');
    game.addGuest('p2');
    game.start();
    game.changeTurn();
    game.currentCard = card;
    game.currentTurn.payday();
    game.currentTurn.downsized();
    game.changeTurn();
    game.rollDice();
    game.changeTurn();
    game.rollDice();
    assert.strictEqual(game.state.currentPlayer.skippedTurns, 0);
  });

  it('Should set the notifications to given notifiers', () => {
    const selectedProfessions = [professions[0], professions[1]];
    const game = new Game(colors, selectedProfessions);
    const card = {
      heading: 'New Card',
      symbol: 'a',
      family: 'downsized',
      type: 'downsized'
    };

    game.notifications = ['a'];
    assert.ok(game.state.notifications.length);
  });

  it('Should add log', () => {
    const player = {
      username: 'p1',
      color: 'red'
    };
    const game = new Game(colors, professions);

    game.addLog(player, 'is red');
    assert.deepStrictEqual(
      game.state.logs,
      [{ username: 'p1', color: 'red', message: 'is red' }]
    );
  });
});
