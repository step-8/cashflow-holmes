const serveCard = (req, res) => {
  const { game } = req;
  const { currentPlayer, ratRace } = game.state;
  const { currentPosition } = currentPlayer;
  const type = ratRace.getCardType(currentPosition);
  const card = game.state.ratRace.getCard(type);
  game.currentCard = card;
  res.json(card);
};

const resetTransaction = (req, res) => {
  req.game.state.currentTurn.resetTransaction();
  res.end();
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

const setCard = (game, action) => {
  const card = game.state.ratRace.getCard(`${action}Deal`);
  game.currentCard = card;
};

const cardActionsHandler = (req, res) => {
  const { action, family, type } = req.body;
  const { game } = req;
  const deals = ['small', 'big'];
  if (deals.includes(action)) {
    setCard(game, action);
  }

  if (action === 'ok') {
    // let status = 200;
    // if (!acceptCard(game, family)) {
    //   status = 207;
    // }
    // res.sendStatus(status);
    acceptCard(game, family);
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


module.exports = { serveCard, cardActionsHandler, resetTransaction };
