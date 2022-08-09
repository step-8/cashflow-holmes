const serveGameDetails = (req, res) => {
  const { game } = req;
  res.json(game);
};

module.exports = { serveGameDetails };
