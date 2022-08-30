const serveCard = (req, res) => {
  const { game, session: { username } } = req;
  const card = game.getCard();
  game.setNotifications(username);
  res.json(card);
};

const resetTransaction = (req, res) => {
  const { game } = req;
  game.currentTurn.resetTransaction();
  res.end();
};

const acceptCard = (game, family, type, username) => {
  if (family === 'payday') {
    const status = game.payday(username);
    game.removeTopNotification();
    return status;
  }

  if (family === 'market' && type === 'damage') {
    game.propertyDamage(username);
    return;
  }

  return game[family](username);
};

const buyDeals = (game, type, count, username) => {
  const types = {
    realEstate: () => game.buyRealEstate(username),
    stock: () => game.buyStocks(username, count),
    lottery: () => game.buyLottery(username),
    goldCoins: () => game.buyGoldCoins(username),
    mlm: () => game.buyMlmDeal(username),
    default: () => game.skip(username)
  };

  const executor = types[type] ? types[type] : types.default;
  executor();
};

const sellAsset = (game, type, value, username) => {
  const types = {
    realEstate: () => game.sellRealEstate(username, value),
    stock: () => game.sellStocks(username, +value),
    goldCoins: () => game.sellGoldCoins(username, +value),
    default: () => game.skip(username)
  };

  const executor = types[type] ? types[type] : types.default;
  executor();
};

const cardActionsHandler = (req, res) => {
  const { action, family, type, value } = req.body;
  const { game, session: { username } } = req;
  const deals = ['small', 'big'];
  if (deals.includes(action)) {
    game.getCard(action);
    res.end();
    return;
  }

  const actions = {
    ok: () => acceptCard(game, family, type, username),
    buy: () => buyDeals(game, type, +value, username),
    skip: () => game.skip(username),
    roll: () => game.activateReroll(),
    sell: () => sellAsset(game, type, value, username)
  };
  actions[action]();
  res.end();
};

module.exports = {
  serveCard, cardActionsHandler, resetTransaction, acceptCard, buyAsset: buyDeals
};
