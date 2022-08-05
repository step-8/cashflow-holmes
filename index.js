const { createApp } = require('./src/app');
require('dotenv').config();

const main = () => {
  const { PORT } = process.env;
  const config = {};
  const app = createApp(config);
  app.listen(PORT, () => console.log(`Server bound to http://localhost:${PORT}`));
};

main();
