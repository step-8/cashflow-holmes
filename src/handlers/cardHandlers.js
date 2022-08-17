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
  if (family === 'payday') {
    game.state.currentTurn.payday();
    return;
  }

  if (family === 'doodad') {
    game.state.currentTurn.doodad();
    return game.state.currentTurn.canPlayerContinue();
  }

  return game.state.currentTurn.skip();
};

const buyDeal = (game, type) => {
  if (type === 'realEstate') {
    game.state.currentTurn.buyRealEstate();
    return;
  }
  game.state.currentTurn.skip();
};

const cardActionsHandler = (req, res) => {
  const { action, family, type } = req.body;
  const { game } = req;
  if (action === 'ok') {
    let status = 200;
    if (!acceptCard(game, family)) {
      status = 207;
    }
    res.sendStatus(status);
  }

  if (action === 'buy') {
    buyDeal(game, type);
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
