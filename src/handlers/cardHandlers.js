const cardTypeHandler = (req, res) => {
  const { game } = req;
  const { currentPlayer, ratRace } = game.state;
  const { currentPosition } = currentPlayer;
  const type = ratRace.getCardType(currentPosition);
  res.json({ type });
};

const serveCard = (req, res) => {
  const { game } = req;
  const { type } = req.params;
  const card = game.state.ratRace.getCard(type);
  game.currentCard = card;
  res.json(card);
};

module.exports = { cardTypeHandler, serveCard };
