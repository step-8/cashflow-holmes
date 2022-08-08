const express = require('express');
const morgan = require('morgan');
const session = require('express-session');

const joinHandler = (req, res, next) => {
  const { roomId } = req.body;
  const { gameId } = req;
  if (gameId === +roomId) {
    res.sendStatus(200);
    return;
  }
  res.sendStatus(400);
};

const joinLobbyHandler = (req, res) => {
  res.end('This is the join Lobby');
};

const createApp = (config) => {
  const app = express();
  app.use(session({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: false,
  }));
  app.use(express.urlencoded({ extended: true }));

  if (config.ENV === 'dev') {
    app.use(morgan('tiny'));
  }

  const gameId = 123;
  app.use((req, res, next) => {
    req.gameId = gameId;
    next();
  });

  app.post('/login', (req, res) => {
    req.session.username = 'gayatri';
    res.end();
  });

  app.post('/join', joinHandler);
  app.get('/join-lobby', joinLobbyHandler);
  app.use(express.static(config.PUBLIC));
  return app;
};

module.exports = { createApp };
