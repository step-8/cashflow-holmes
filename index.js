const { createApp } = require('./src/app');
const { persistCredentials } = require('./src/handlers/saveUserCredentials.js');
require('dotenv').config();

const main = () => {
  const { PORT } = process.env;
  const config = { ...process.env, persistCredentials };
  const app = createApp(config);

  app.listen(PORT,
    () => console.log(`Server bound to http://localhost:${PORT}`));
};

main();
