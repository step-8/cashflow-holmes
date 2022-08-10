const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { registerRouter } = require('./routers/register.js');
const { loginRouter } = require('./routers/login.js');
const { readCredentials } = require('./helpers/readCredentials.js');
const { protectedRoutes } = require('./middleware/protectedRouter.js');
const { createGameRouter } = require('./routers/gameRouter.js');

const createApp = (config, session) => {
  const app = express();
  readCredentials(config);

  app.use(session);
  if (config.ENV === 'dev') {
    app.use(morgan('dev'));
  }
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));

  app.use(protectedRoutes(createGameRouter(express.Router())));
  app.use(['/host', '/logout'], (req, res) => {
    res.status(401);
    res.end();
  });


  app.use('/register', registerRouter(express.Router(), config));
  app.use('/login', loginRouter(express.Router(), config));

  app.use(express.static(config.PUBLIC));

  app.get('/', (req, res, next) => {
    if (!req.session.username) {
      res.redirect('/login');
      return;
    }
    next();
  });

  return app;
};

module.exports = { createApp };
