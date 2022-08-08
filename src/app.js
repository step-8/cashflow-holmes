const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { registerRouter } = require('./routers/register.js');
const { readCredentials } = require('./helpers/readCredentials.js');
const { hostHandler } = require('./handlers/hostHandler.js');
const { serveMainMenu } = require('./handlers/serveMainMenu.js');

const createApp = (config) => {
  const app = express();
  readCredentials(config);

  app.use(express.static('public'));
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(session({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: false,
  }));

  app.get('/', serveMainMenu);
  app.get('/host', hostHandler);
  app.use('/register',
    registerRouter(express.Router(), config));
  app.use(express.static(config.PUBLIC));

  app.post('/login', (req, res) => {
    req.session.username = 'gayatri';
    res.end();
  });

  return app;
};

module.exports = { createApp };
