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

const acceptCard = (game, family, type) => {
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

  if (type === 'lottery') {
    return game.buyLottery();
  }

  game.skip();
};

const cardActionsHandler = (req, res) => {
  const { action, family, type, count } = req.body;
  const { game } = req;
  const deals = ['small', 'big'];
  if (deals.includes(action)) {
    game.getCard(action);
  }

  if (action === 'ok') {
    acceptCard(game, family, type);
  }

  if (action === 'buy') {
    buyDeal(game, type, +count);
  }

  if (action === 'skip') {
    game.skip();
  }

  if (action === 'roll') {
    game.activateReroll();
  }

  if (action === 'sell') {
    const { username } = req.session;
    game.sellStocks(username, +count);
  }
  res.end();
};


module.exports = {
  serveCard, cardActionsHandler, resetTransaction, acceptCard, buyDeal
};
