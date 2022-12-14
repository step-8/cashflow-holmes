const fetchReq = (path, options) => {
  return fetch(path, options);
};

const fetchHandler = (path, options) => {
  return fetch(path, options)
    .then((response) => new Promise((res, rej) => res.status >= 400 ? rej(response) : res(response)));
};

const fetchJson = (path, options) => {
  return fetchReq(path, options)
    .then(res => res.json());
};

const API = {
  joinGame: (options) => fetchReq('/join', options),
  assignCard: () => fetchReq('/card/type'),
  cardAction: (options) => fetchReq('/card/card-action', options),
  removeNotification: () => fetchReq('card/remove-notify'),
  cancelGame: () => fetchReq('/remove-game'),
  playerInfo: () => fetchReq('/api/player-info'),
  getGame: () => fetchReq('/api/game'),
  getGameJson: () => fetchJson('/api/game'),
  changeTurn: () => fetchReq('/change-turn'),
  rollDice: (diceCount) => fetchReq(`/roll-dice/${diceCount}`),
  reRollDice: () => fetchReq('/reroll'),
  getProfession: () => fetchReq('/api/profession'),
  resetTransaction: () => fetchReq('/card/reset-transaction'),
  takeLoan: (options) => fetchReq('/loan/take', options),
  payLoan: (options) => fetchReq('/loan/pay', options),
  sellAllAssets: (options) => fetchReq('/sell-all-assets', options)
};

