const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const { registerRouter } = require('./routers/register.js');
const { readCredentials } = require('./helpers/readCredentials.js');


const createApp = (config) => {
  const app = express();
  readCredentials(config);

  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(session({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: false,
  }));

  app.use('/register',
    registerRouter(express.Router(), config));
  app.use(express.static(config.PUBLIC));
  return app;
};

module.exports = { createApp };
