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
    game.addPlayer('newPlayer');
    const allPlayers = game.allPlayerDetails;
    assert.strictEqual(allPlayers.length, 1);
  });

  it('Should not add a player if joined the game', () => {
    const game = new Game(colors, professions);
    game.addPlayer('newPlayer');
    game.addPlayer('newPlayer');
    const allPlayers = game.allPlayerDetails;
    assert.strictEqual(allPlayers.length, 1);
  });

  it('Should remove a player if already exists', () => {
    const game = new Game(colors, professions);
    game.addPlayer('newPlayer');
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
    game.addPlayer('p1');
    game.addPlayer('p2');
    game.addPlayer('p3');
    game.addPlayer('p4');
    game.addPlayer('p5');
    game.addPlayer('p6');
    assert.ok(game.isLobbyFull());
  });

  it('Should give false if the lobby is not full ', () => {
    const game = new Game(colors, professions);
    game.assignGameID(1234);
    game.addPlayer('p1');
    assert.ok(!game.isLobbyFull());
  });

  it('Should give the current player', () => {
    const game = new Game(colors, professions);
    game.assignGameID(1234);
    game.addPlayer('p1');
    game.addPlayer('p2');
    game.start();
    assert.ok(game.state.currentPlayer.username === 'p1');
  });

  it('Should change the turn to other player', () => {
    const game = new Game(colors, professions);
    game.assignGameID(1234);
    game.addPlayer('p1', 'host');
    game.addPlayer('p2', 'guest');
    game.start();
    game.changeTurn();
    assert.ok(game.state.currentPlayer.username === 'p2');
  });

  it('Should change the rolled dice of current player to true', () => {
    const game = new Game(colors, professions);
    game.assignGameID(1234);
    game.addPlayer('p1', 'host');
    game.addPlayer('p2', 'guest');
    game.start();
    game.rollDice();

    assert.ok(game.state.currentPlayer.isRolledDice);
  });

  it('Should change the turn to other player', () => {
    const selectedProfessions = [professions[0], professions[1]];
    const game = new Game(colors, selectedProfessions);
    const card = {
      heading: 'New Card',
      symbol: 'a',
      family: 'downsized',
      type: 'downsized'
    };

    game.assignGameID(1234);
    game.addPlayer('p1', 'host');
    game.addPlayer('p2', 'guest');
    game.start();
    game.changeTurn();
    game.currentCard = card;
    game.currentTurn.payday();
    game.currentTurn.downsized();
    game.rollDice();
    assert.ok(game.state.currentPlayer.username === 'p1');
  });

  it('Should return the player matching with user name', () => {
    const game = new Game(colors, professions);
    game.assignGameID(1234);
    game.addPlayer('p1', 'host');
    game.addPlayer('p2', 'guest');

    const actualPlayer = game.getPlayer('p2');
    assert.strictEqual(actualPlayer.details.username, 'p2');
  });
});
