const serveCard = (req, res) => {
  const { game } = req;
  const { currentPlayer, ratRace } = game.state;
  const { currentPosition } = currentPlayer;
  const type = ratRace.getCardType(currentPosition);
  const card = game.state.ratRace.getCard(type, currentPlayer);
  game.currentCard = card;
  res.json(card);
};

const removeNotifier = (req, res) => {
  const { game } = req;
  game.removeNotifier();
  res.end();
};

const resetTransaction = (req, res) => {
  req.game.state.currentTurn.resetTransaction();
  res.end();
};

const acceptCard = (game, family) => {
  if (family === 'payday') {
    return game.state.currentTurn.payday();
  }

  if (family === 'doodad') {
    game.state.currentTurn.doodad();
    return game.state.currentTurn.canPlayerContinue();
  }

  if (family === 'charity') {
    return game.state.currentTurn.charity();
  }

  if (family === 'baby') {
    return game.state.currentTurn.baby();
  }

  if (family === 'downsized') {
    game.state.currentTurn.downsized();
    return;
  }

  return game.state.currentTurn.skip();
};

const buyDeal = (game, type, count) => {
  if (type === 'realEstate') {
    return game.state.currentTurn.buyRealEstate();
  }

  if (type === 'stock') {
    return game.state.currentTurn.buyStocks(count);
  }
  game.state.currentTurn.skip();
};

const setCard = (game, action) => {
  const { currentPlayer } = game.state;
  const card = game.state.ratRace.getCard(`${action}Deal`, currentPlayer);
  game.currentCard = card;
};

const cardActionsHandler = (req, res) => {
  const { action, family, type, count } = req.body;
  const { game } = req;
  const deals = ['small', 'big'];
  if (deals.includes(action)) {
    setCard(game, action);
  }

  if (action === 'ok') {
    acceptCard(game, family);
  }

  if (action === 'buy') {
    buyDeal(game, type, count);
  }

  if (action === 'skip') {
    game.state.currentTurn.skip();
  }

  if (action === 'sell') {
    game.state.currentTurn.skip();
  }
  res.end();
};


module.exports = {
  serveCard, cardActionsHandler, resetTransaction, removeNotifier
};
