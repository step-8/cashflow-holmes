const serveCard = (req, res) => {
  const { game } = req;
  const { currentPlayer, ratRace } = game.state;
  const { currentPosition } = currentPlayer;
  const type = ratRace.getCardType(currentPosition);
  const card = game.state.ratRace.getCard(type);
  const notifications = game.state.ratRace.getNotifications(
    type, currentPlayer
  );
  game.currentCard = card;
  game.notifications = notifications;
  res.json(card);
};

const resetTransaction = (req, res) => {
  req.game.state.currentTurn.resetTransaction();
  res.end();
};

const removeNotification = (game) => {
  const notifications = game.state.notifications;
  game.notifications = notifications.slice(1);
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
  serveCard, cardActionsHandler, resetTransaction
};
