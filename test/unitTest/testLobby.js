const { assert } = require('chai');
const professions = require('../../data/professions.json');
const { Dice } = require('../../src/models/die');
const { Lobby } = require('../../src/models/lobby');

describe('Lobby', () => {
  it('Should add a player if not joined the game', () => {
    const lobby = new Lobby(1234, ['red', 'blue'], professions, new Dice(2, 6));
    lobby.addGuest('newPlayer');
    const allPlayers = lobby.allPlayerDetails;
    assert.strictEqual(allPlayers.length, 1);
  });

  it('Should not add a player if joined the game', () => {
    const lobby = new Lobby(1234, ['red', 'blue'], professions, new Dice(2, 6));
    lobby.addGuest('newPlayer');
    lobby.addGuest('newPlayer');
    const allPlayers = lobby.allPlayerDetails;
    assert.strictEqual(allPlayers.length, 1);
  });

  it('Should remove a player if already exists', () => {
    const lobby = new Lobby(1234, ['red', 'blue'], professions, new Dice(2, 6));
    lobby.addGuest('newPlayer');
    lobby.removePlayer('newPlayer');
    const allPlayers = lobby.allPlayerDetails;
    assert.strictEqual(allPlayers.length, 0);
  });

  it('Should validate the given gameID', () => {
    const lobby = new Lobby(1234, ['red', 'blue'], professions, new Dice(2, 6));
    assert.isOk(lobby.isValid(1234));
  });

  it('Should give true if the lobby is full ', () => {
    const lobby = new Lobby(1234, ['red', 'blue'], professions, new Dice(2, 6));
    lobby.addGuest('p1');
    lobby.addGuest('p2');
    lobby.addGuest('p3');
    lobby.addGuest('p4');
    lobby.addGuest('p5');
    lobby.addGuest('p6');
    assert.isOk(lobby.isFull());
  });

  it('Should give false if the lobby is not full ', () => {
    const lobby = new Lobby(1234, ['red', 'blue'], professions, new Dice(2, 6));
    assert.isNotOk(lobby.isFull());
  });
});
