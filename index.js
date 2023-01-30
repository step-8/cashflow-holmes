const { createApp } = require('./src/app');
const expressSession = require('express-session');
const { createClient } = require('redis');

const { persistCredentials } = require('./src/handlers/authHandlers.js');
require('dotenv').config();

const main = () => {
  const { PORT, URL } = process.env;

  const config = { ...process.env, persistCredentials };
  const session = expressSession({
    secret: config.SECRET, resave: false, saveUninitialized: false
  });

  // Reddis DB is porperly working.

  // const DB = createClient({ url: URL });
  // DB.on('error', (err) => console.log('DB Client Error', err));
  // DB.connect().then(() => {
  //   const app = createApp(config, session, DB);
  //   app.listen(PORT,
  //     () => console.log(`Server bound to http://localhost:${PORT}`));
  // }
  // );

  const app = createApp(config, session);
  app.listen(PORT, () => {
    console.log(`Server bound to http://localhost:${PORT}`);
  });
};

main();
