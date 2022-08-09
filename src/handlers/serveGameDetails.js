const serveGameDetails = (req, res) => {
  const { game } = req;
  res.json(game.state);
};

module.exports = { serveGameDetails };
