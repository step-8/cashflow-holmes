const { RAT_RACE_BOARD, GUEST_LOBBY, MAIN_MENU_PAGE, PROFESSION_CARD } = require('../utils/pages.js');

const serveMainMenu = (req, res) => {
  res.send(MAIN_MENU_PAGE);
};

const hostHandler = (req, res) => {
  res.redirect('/host-lobby');
};

const startGameHandler = (req, res) => {
  req.game.start();
  res.end();
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
  const { username } = req.session;
  game.addPlayer(username, 'guest');

  res.end(GUEST_LOBBY);
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

module.exports = {
  serveMainMenu,
  hostHandler,
  startGameHandler,
  cancelGameHandler,
  guestLobbyHandler,
  showProfessionHandler,
  gameBoardHandler,
  removeGameIdHandler
};
