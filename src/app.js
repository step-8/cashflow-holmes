const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { registerRouter } = require('./routers/register.js');
const { readCredentials } = require('./helpers/readCredentials.js');
const { hostHandler } = require('./handlers/hostHandler.js');
const { serveMainMenu } = require('./handlers/serveMainMenu.js');
const { joinHandler } = require('./handlers/joinHandler.js');
const { joinLobbyHandler } = require('./handlers/joinLobbyHandler.js');

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
    app.use(morgan('tiny'));
  }

  app.use(express.static(config.PUBLIC));
  app.get('/', serveMainMenu);
  app.get('/host', hostHandler);
  app.use('/register',
    registerRouter(express.Router(), config));

  app.post('/login', (req, res) => {
    req.session.username = 'gayatri';
    res.end();
  });

  const gameId = 123;
  const game = {
    gameId,
    colors: ['lightblue', 'green', 'orange', 'red', 'brown', 'yellow'],
    players: []
  };

  app.use((req, res, next) => {
    req.gameId = game.gameId;
    req.game = game;
    next();
  });

  app.post('/join', joinHandler);
  app.get('/join-lobby', joinLobbyHandler);

  return app;
};

module.exports = { createApp };
