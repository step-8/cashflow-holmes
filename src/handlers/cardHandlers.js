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

  if (family === 'market' && type === 'damage') {
    game.propertyDamage();
    return;
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

  if (type === 'goldCoins') {
    return game.buyGoldCoins();
  }

  game.skip();
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
    ok: () => acceptCard(game, family, type),
    buy: () => buyDeal(game, type, +count),
    skip: () => game.skip(username),
    roll: () => game.activateReroll(),
    sell: () => game.sellStocks(username, +count)
  };
  console.log(action, '---------------------ACTION ++++++++++++++');
  actions[action]();
  res.end();
};


module.exports = {
  serveCard, cardActionsHandler, resetTransaction, acceptCard, buyDeal
};
