const express = require('express');
const session = require('express-session');
const { hostHandler } = require('./handlers/hostHandler');

const createApp = (config) => {
  const app = express();
  app.use(session({
    secret: 'a',
  }));

  app.post('/login', (req, res) => {
    req.session.username = 'gayatri';
    res.end();
  });
  app.get('/', hostHandler);
  return app;
};

module.exports = { createApp };
