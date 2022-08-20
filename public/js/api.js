const fetchReq = (path, options) => {
  return fetch(path, options);
};

const API = {
  joinGame: (options) => fetchReq('/join', options),
  assignCard: () => fetchReq('/card/type'),
  cardAction: (options) => fetchReq('/card/card-action', options),
  removeNotification: () => fetchReq('card/remove-notify'),
  cancelGame: () => fetchReq('/remove-gameid'),
  userInfo: () => fetchReq('/get-user-info'),
  playerInfo: () => fetchReq('/api/player-info'),
  getGame: () => fetchReq('/api/game'),
  changeTurn: () => fetchReq('/change-turn'),
  rollDice: (dice) => fetchReq(`/roll-dice/${dice}`),
  getProfession: () => fetchReq('/api/profession'),
  resetTransaction: () => fetchReq('/card/reset-transaction'),
  takeLoan: (options) => fetchReq('/loan/take', options),
  payLoan: (options) => fetchReq('/loan/pay', options),
};

