const serveCard = (req, res) => {
  const { game } = req;
  const card = game.getCard();
  game.setNotifications();
  res.json(card);
};

const resetTransaction = (req, res) => {
  req.game.state.currentTurn.resetTransaction();
  res.end();
};

const removeNotification = (game) => {
  game.removeTopNotification();
};

const acceptCard = (game, family) => {
  if (family === 'payday') {
    game.payday();
    return removeNotification(game);
  }

  return game[family]();
};

const buyDeal = (game, type, count) => {
  if (type === 'realEstate') {
    return game.buyRealEstate();
  }

  if (type === 'stock') {
    return game.buyStocks(count);
  }

  game.skip();
};

const sellStocks = (game, type, count) => {
  if (type === 'stock') {
    return game.sellStocks(count);
  }

  game.skip();
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
    game.skip();
  }

  if (action === 'sell') {
    sellStocks(game, type, count);
  }
  res.end();
};


module.exports = {
  serveCard, cardActionsHandler, resetTransaction, acceptCard, buyDeal, sellStocks
};
