const cardTypeHandler = (req, res) => {
  const { game } = req;
  const { currentPlayer, ratRace } = game.state;
  const { currentPosition } = currentPlayer;
  const type = ratRace.getCardType(currentPosition);
  res.json({ type });
};

module.exports = { cardTypeHandler };
