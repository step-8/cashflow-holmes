const { Game } = require('../../src/models/game');
const assert = require('assert');

describe('Game', () => {
  const colors = ['a', 'b', 'c', 'd', 'e', 'f'];
  const professions = colors.reverse();
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
});
