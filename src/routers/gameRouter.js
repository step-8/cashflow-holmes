const { hostHandler } = require('../handlers/hostHandler.js');
const { serveMainMenu } = require('../handlers/serveMainMenu.js');
const { joinHandler } = require('../handlers/joinHandler.js');
const { createApiRouter } = require('./apiRouter.js');
const { hostLobbyHandler } = require('../handlers/hostLobbyHandler.js');
const { guestLobbyHandler } = require('../handlers/guestLobbyHandler.js');
const { injectGame } = require('../handlers/injectGame.js');
const { leaveLobbyHandler } = require('../handlers/leaveLobbyHandler.js');
const { logoutHandler } = require('../handlers/logout.js');
const { startGameHandler } = require('../handlers/startGameHandler.js');
const { cancelGameHandler } = require('../handlers/cancelGameHandler.js');
const { showProfessionHandler } = require('../handlers/showProfessionHandler.js');

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
  router.get('/show-profession', showProfessionHandler);
  router.use('/logout', logoutHandler);

  router.use(['/login', '/register'], (req, res) => res.redirect('/'));
  return router;
};

module.exports = { createGameRouter };
