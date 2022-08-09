const startGameHandler = (req, res) => {
  req.game.start();
  res.end();
};

module.exports = { startGameHandler };
