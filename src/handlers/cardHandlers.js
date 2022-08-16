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
    req.game.state.currentTurn.skip();
  }

  if (action === 'buy') {
    req.game.state.currentTurn.skip();
  }

  if (action === 'skip') {
    req.game.state.currentTurn.skip();
  }

  if (action === 'sell') {
    req.game.state.currentTurn.skip();
  }
  res.end();
};


module.exports = { cardTypeHandler, serveCard, cardActionsHandler };
