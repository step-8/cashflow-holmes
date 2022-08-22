const assert = require('assert');
const { Games } = require('../../src/models/games');
const professions = require('../../data/professions.json');

describe('Games', () => {
  const colors = ['a', 'b', 'c', 'd', 'e', 'f'];

  describe('newGame', () => {
    const games = new Games(colors, professions);
    it('Should start a newGame', () => {
      games.newGame();
      const gameID = games.latestGameID;
      assert.ok(games.getGame(gameID));
      assert.strictEqual(games.latestGameID, 1);
    });
  });

  describe('endGame', () => {
    const games = new Games(colors, professions);
    it('Should end an existing game', () => {
      games.newGame();
      const gameID = games.latestGameID;
      games.endGame(games.latestGameID);
      assert.ok(!games.getGame(gameID));
    });
  });

  describe('getGame', () => {
    const games = new Games(colors, professions);
    it('Should get game of given valid gameID', () => {
      games.newGame();
      const gameID = games.latestGameID;
      assert.ok(games.getGame(gameID));
    });

    it('Should not give game if id is not valid', () => {
      assert.ok(!games.getGame('abc'));
    });
  });

});
