const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { registerRouter, loginRouter } = require('./routers/authRouter.js');
const { readCredentials } = require('./helpers/readCredentials.js');
const { protectedRoutes } = require('./middleware/protectedRouter.js');
const { createGameRouter } = require('./routers/gameRouter.js');
const { authenticate } = require('./handlers/authHandlers.js');

const createApp = (config, session, DB) => {
  const app = express();
  readCredentials(config);

  app.use(session);
  if (config.ENV === 'dev') {
    app.use(morgan('dev'));
    app.use((req, res, next) => {
		console.log(req.ip);
		next();
	});
  }
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(config.PUBLIC));

  app.use(['/register', '/login'], authenticate);
  app.use('/register', registerRouter(express.Router(), config));
  app.use('/login', loginRouter(express.Router(), config));
  app.use(protectedRoutes(createGameRouter(express.Router(), config, DB)));

  return app;
};

module.exports = { createApp };
