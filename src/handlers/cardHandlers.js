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

const acceptCard = (game, family) => {
  // console.log(family);
  if (family === 'payday') {
    game.state.currentTurn.payday();
    return;
  }

  game.state.currentTurn.skip();
};


const cardActionsHandler = (req, res) => {
  const { action, family } = req.body;
  const { game } = req;
  if (action === 'ok') {
    acceptCard(game, family);
  }

  if (action === 'buy') {
    game.state.currentTurn.skip();
  }

  if (action === 'skip') {
    game.state.currentTurn.skip();
  }

  if (action === 'sell') {
    game.state.currentTurn.skip();
  }
  res.end();
};


module.exports = { cardTypeHandler, serveCard, cardActionsHandler };
