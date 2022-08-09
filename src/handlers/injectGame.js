const { Game } = require('../models/game.js');

const injectGame = () => {
  const colors = ['blue', 'green', 'yellow', 'pink', 'violet', 'orange'];
  const professions = [
    'doctor', 'police', 'pilot', 'janitor', 'lawyer', 'mechanic'
  ];
  const game = new Game(colors, professions);

  return (req, res, next) => {
    req.game = game;
    next();
  };
};

module.exports = { injectGame };
