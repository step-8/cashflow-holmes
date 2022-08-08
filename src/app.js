const express = require('express');
const session = require('express-session');
const { hostHandler } = require('./handlers/hostHandler');
const { serveMainMenu } = require('./handlers/serveMainMenu');

const createApp = (config) => {
  const app = express();
  app.use(session({
    secret: 'a',
    resave: false,
    saveUninitialized: false,
  }));

  app.post('/login', (req, res) => {
    req.session.username = 'gayatri';
    res.end();
  });

  app.get('/', serveMainMenu);
  app.get('/host', hostHandler);

  return app;
};

module.exports = { createApp };
