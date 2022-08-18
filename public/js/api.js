const fetchReq = (path, options) => {
  return fetch(path, options);
};

const API = {
  joinGame: (options) => fetchReq('/join', options),
  assignCard: () => fetchReq('/card/type'),
  cardAction: (options) => fetchReq('/card/card-action', options),
  cancelGame: () => fetchReq('/remove-gameid'),
  userInfo: () => fetchReq('/get-user-info'),
  playerInfo: () => fetchReq('/api/player-info'),
  getGame: () => fetchReq('/api/game'),
  changeTurn: () => fetchReq('/change-turn'),
  rollDice: () => fetchReq('/roll-dice'),
  getProfession: () => fetchReq('/api/profession'),
  resetTransaction: () => fetchReq('/card/reset-transaction')
};

