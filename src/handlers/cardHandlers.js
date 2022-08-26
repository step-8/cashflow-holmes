const serveCard = (req, res) => {
  const { game } = req;
  const card = game.getCard();
  game.setNotifications();
  res.json(card);
};

const resetTransaction = (req, res) => {
  const { game } = req;
  game.currentTurn.resetTransaction();
  res.end();
};

const removeNotification = (game) => {
  game.removeTopNotification();
};

const acceptCard = (game, family, type, username) => {
  if (family === 'payday') {
    game.payday(username);
    return removeNotification(game);
  }

  if (family === 'market' && type === 'damage') {
    game.propertyDamage(username);
    return;
  }

  return game[family](username);
};

const buyDeal = (game, type, count, username) => {
  if (type === 'realEstate') {
    return game.buyRealEstate(username);
  }

  if (type === 'stock') {
    return game.buyStocks(username, count);
  }

  if (type === 'lottery') {
    return game.buyLottery(username);
  }

  if (type === 'goldCoins') {
    return game.buyGoldCoins(username);
  }

  game.skip(username);
};

const cardActionsHandler = (req, res) => {
  const { action, family, type, count } = req.body;
  const { game, session: { username } } = req;
  const deals = ['small', 'big'];
  if (deals.includes(action)) {
    game.getCard(action);
    res.end();
    return;
  }

  const actions = {
    ok: () => acceptCard(game, family, type, username),
    buy: () => buyDeal(game, type, +count, username),
    skip: () => game.skip(username),
    roll: () => game.activateReroll(),
    sell: () => game.sellStocks(username, +count)
  };
  actions[action]();
  res.end();
};


module.exports = {
  serveCard, cardActionsHandler, resetTransaction, acceptCard, buyDeal
};
