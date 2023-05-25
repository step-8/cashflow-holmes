const cluster = require('cluster');
const CPUs = require('os').cpus();
const { createApp } = require('./src/app');
const expressSession = require('express-session');
const { createClient } = require('redis');

const { persistCredentials } = require('./src/handlers/authHandlers.js');
require('dotenv').config();

const forkWorkers = () => {
  CPUs.forEach((CPU) => {
    console.log('\nCreating fork');
    console.info(CPU);
    cluster.fork();
    console.log('Finished creating fork');
  });
};

const onExit = (worker, code, signal) => {
  console.error(`\nWorker ${worker.process.pid} died`);
  console.info({ code, signal });
  console.log("Let's fork another worker!");
  cluster.fork();
};

const main = () => {
  const { PORT, URL } = process.env;

  const config = { ...process.env, persistCredentials };
  const session = expressSession({
    secret: config.SECRET,
    resave: false,
    saveUninitialized: false,
  });

  // Redis DB is properly working.

  // const DB = createClient({ url: URL });
  // DB.on('error', (err) => console.log('DB Client Error', err));
  // DB.connect().then(() => {
  //   const app = createApp(config, session, DB);
  //   app.listen(PORT,
  //     () => console.log(`Server bound to http://localhost:${PORT}`));
  // }
  // );

  if (cluster.isMaster) {
    console.log(`Number of CPUs is ${CPUs.length}`);
    console.log(`Master ${process.pid} is running`);

    forkWorkers();

    cluster.on('exit', onExit);
  } else {
    const app = createApp(config, session);
    app.listen(+PORT, () =>
      console.log(
        `\nWorker ${process.pid} listening on port ${PORT}
        Server started at http://localhost:${PORT}`
      )
    );
  }
};

main();
