const { createApp } = require('./src/app');
const { persistCredentials } = require('./src/handlers/saveUserCredentials.js');
require('dotenv').config();

const main = () => {
  const { PORT, PUBLIC, REGISTER_PAGE, CRED_PATH, SECRET } = process.env;
  const config = { PORT, PUBLIC, REGISTER_PAGE, CRED_PATH, SECRET, persistCredentials };
  const app = createApp(config);

  app.listen(PORT,
    () => console.log(`Server bound to http://localhost:${PORT}`));
};

main();
