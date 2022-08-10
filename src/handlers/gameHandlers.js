const { RAT_RACE_BOARD } = require('../utils/pages.js');

const gameBoardHandler = (req, res) => {
  res.send(RAT_RACE_BOARD);
};

module.exports = { gameBoardHandler };
