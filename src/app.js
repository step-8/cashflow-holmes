const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { registerRouter } = require('./routers/register.js');
const { loginRouter } = require('./routers/login.js');
const { readCredentials } = require('./helpers/readCredentials.js');
const { hostHandler } = require('./handlers/hostHandler.js');
const { serveMainMenu } = require('./handlers/serveMainMenu.js');
const { joinHandler } = require('./handlers/joinHandler.js');
const { guestLobbyHandler } = require('./handlers/guestLobbyHandler.js');
const { createApiRouter } = require('./routers/apiRouter.js');
const { hostLobbyHandler } = require('./handlers/hostLobbyHandler.js');
const { Game } = require('./models/game.js');

const createApp = (config) => {
  const app = express();
  readCredentials(config);

  app.use(session({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: false,
  }));

  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));

  if (config.ENV === 'dev') {
    app.use(morgan('dev'));
  }

  app.use(express.static(config.PUBLIC));
  app.get('/', serveMainMenu);
  app.use('/register', registerRouter(express.Router(), config));
  app.use('/login', loginRouter(express.Router(), config));

  app.use((req, res, next) => {
    const colors = ['blue', 'green', 'pink', 'yellow', 'violet', 'orange'];
    const game = new Game(123, colors, colors);
    req.game = game;
    next();
  });

  app.use('/api', createApiRouter());
  app.get('/host', hostHandler);
  app.get('/host-lobby', hostLobbyHandler);
  app.post('/join', joinHandler);
  app.get('/guest-lobby', guestLobbyHandler);

  return app;
};

module.exports = { createApp };
