const { Game } = require('../models/game.js');
const professions = require('../../data/professions.json');

const injectGame = () => {
  const colors = ['blue', 'green', 'yellow', 'pink', 'violet', 'orange'];
  const game = new Game(colors, professions);

  return (req, res, next) => {
    req.game = game;
    next();
  };
};

module.exports = { injectGame };
