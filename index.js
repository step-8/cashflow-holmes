const { createApp } = require('./src/app');
const expressSession = require('express-session');
const { persistCredentials } = require('./src/handlers/saveUserCredentials.js');
require('dotenv').config();

const main = () => {
  const { PORT } = process.env;

  const config = { ...process.env, persistCredentials };
  const session = expressSession({
    secret: config.SECRET, resave: false, saveUninitialized: false
  });

  const app = createApp(config, session);

  app.listen(PORT,
    () => console.log(`Server bound to http://localhost:${PORT}`));
};

main();
