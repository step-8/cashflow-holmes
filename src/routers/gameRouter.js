const { joinHandler } = require('../handlers/joinHandler.js');
const { createApiRouter } = require('./apiRouter.js');
const { hostLobbyHandler } = require('../handlers/hostLobbyHandler.js');
const { injectGame } = require('../handlers/injectGame.js');
const { leaveLobbyHandler } = require('../handlers/leaveLobbyHandler.js');
const { logoutHandler } = require('../handlers/logout.js');
const { NOT_FOUND } = require('../utils/pages.js');
const { cardTypeHandler } = require('../handlers/cardHandlers.js');
const {
  gameBoardHandler,
  guestLobbyHandler,
  serveMainMenu,
  showProfessionHandler,
  startGameHandler,
  cancelGameHandler,
  hostHandler,
  removeGameIdHandler,
  getUserInfoHandler,
  rollDiceHandler,
  changeTurnHandler,
} = require('../handlers/gameHandlers.js');

const createGameRouter = (router) => {
  router.use(injectGame());
  router.get('/', serveMainMenu);
  router.get('/host', hostHandler);
  router.get('/start-game', startGameHandler);
  router.post('/join', joinHandler);
  router.use('/api', createApiRouter());
  router.get('/host-lobby', hostLobbyHandler);
  router.get('/guest-lobby', guestLobbyHandler);
  router.get('/leave-lobby', leaveLobbyHandler);
  router.get('/cancel-game', cancelGameHandler);
  router.get('/get-user-info', getUserInfoHandler);
  router.get('/roll-dice', rollDiceHandler);
  router.get('/change-turn', changeTurnHandler);
  router.get('/show-profession', showProfessionHandler);
  router.get('/game-board', gameBoardHandler);
  router.get('/remove-gameid', removeGameIdHandler);
  router.use('/logout', logoutHandler);
  router.use('/card/card-type', cardTypeHandler);
  router.use(['/login', '/register'], (req, res) => res.redirect('/'));
  router.use((req, res) => {
    res.status(404);
    res.end(NOT_FOUND);
  });
  return router;
};

module.exports = { createGameRouter };
