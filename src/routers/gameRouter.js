const { hostHandler } = require('../handlers/hostHandler.js');
const { serveMainMenu } = require('../handlers/serveMainMenu.js');
const { joinHandler } = require('../handlers/joinHandler.js');
const { joinLobbyHandler } = require('../handlers/joinLobbyHandler.js');

const createGameRouter = (router) => {
  router.get('/', serveMainMenu);
  
  router.use((req, res, next) => {
    const gameId = 123;
    const game = {
      gameId,
      colors: ['lightblue', 'green', 'orange', 'red', 'brown', 'yellow'],
      players: []
    };
    req.gameId = game.gameId;
    req.game = game;
    next();
  });

  router.get('/host', hostHandler);
  router.post('/join', joinHandler);
  router.get('/join-lobby', joinLobbyHandler);
  
  router.use(['/login', '/register'], (req, res) => res.redirect('/'));
  return router;
};

module.exports = { createGameRouter };
