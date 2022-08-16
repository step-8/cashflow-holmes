const cardTypeHandler = (req, res) => {
  const { game } = req;
  const { currentPlayer, ratRace } = game.state;
  const { currentPosition } = currentPlayer;
  const type = ratRace.getCardType(currentPosition);
  game.currentCard = 'deals';
  res.json({ type });
};

const serveCard = (req, res) => {
  const { game } = req;
  const { type } = req.params;
  const card = game.state.ratRace.getCard(type);
  game.currentCard = card;
  res.json(card);
};


const cardActionsHandler = (req, res) => {
  const { action } = req.body;
  if (action === 'ok') {
    req.game.turnCompleted = true;
  }

  if (action === 'buy') {
    req.game.turnCompleted = true;
  }

  if (action === 'skip') {
    req.game.turnCompleted = true;
  }

  if (action === 'sell') {
    req.game.turnCompleted = true;
  }
  res.end();
};


module.exports = { cardTypeHandler, serveCard, cardActionsHandler };
