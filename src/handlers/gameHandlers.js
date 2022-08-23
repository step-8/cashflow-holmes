const { RAT_RACE_BOARD, GUEST_LOBBY, MAIN_MENU_PAGE, PROFESSION_CARD } = require('../utils/pages.js');

const reRollHandler = (req, res) => {
  req.game.reRollDice();
  res.end();
};

const serveMainMenu = (req, res) => {
  const { username } = req.session;
  const htmlPage = MAIN_MENU_PAGE.replace('__USERNAME__', username);
  res.send(htmlPage);
};

const hostHandler = (req, res) => {
  res.redirect('/host-lobby');
};

const startGameHandler = (req, res) => {
  req.game.start();
  res.redirect('/show-profession');
};

const cancelGameHandler = (req, res) => {
  const { game } = req;
  game.cancel();
  req.session.gameID = null;
  res.redirect('/');
  return;
};

const guestLobbyHandler = (req, res) => {
  const { game } = req;
  const { username, gameID } = req.session;

  game.addGuest(username);
  const guestHtml = GUEST_LOBBY
    .replace('__GAME_ID__', gameID)
    .replace('__USERNAME__', username);
  res.send(guestHtml);
};

const showProfessionHandler = (req, res) => {
  res.send(PROFESSION_CARD);
};

const gameBoardHandler = (req, res) => {
  res.send(RAT_RACE_BOARD);
};

const removeGameIdHandler = (req, res) => {
  req.session.gameID = null;
  res.end();
};

const getUserInfoHandler = (req, res) => {
  res.json({ username: req.session.username });
};

const rollDiceHandler = (req, res) => {
  const { game } = req;
  const { diceCount } = req.params;
  game.rollDice(+diceCount);
  res.end();
};

const changeTurnHandler = (req, res) => {
  const { game } = req;
  if (game.state.isTurnEnded) {
    game.changeTurn();
  }
  res.end();
};

module.exports = {
  serveMainMenu,
  hostHandler,
  startGameHandler,
  cancelGameHandler,
  guestLobbyHandler,
  showProfessionHandler,
  gameBoardHandler,
  removeGameIdHandler,
  getUserInfoHandler,
  rollDiceHandler,
  changeTurnHandler,
  reRollHandler
};
