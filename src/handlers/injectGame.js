const professions = require('../../data/professions.json');
const { Games } = require('../models/games.js');

const injectGame = () => {
  const colors = ['blue', 'green', 'yellow', 'pink', 'violet', 'orange'];
  const games = new Games(colors, professions);

  return (req, res, next) => {
    req.games = games;

    const gameID = req.session.gameID;
    if (gameID) {
      const game = games.getGame(gameID);
      req.game = game;
    }
    next();
  };
};

module.exports = { injectGame };
