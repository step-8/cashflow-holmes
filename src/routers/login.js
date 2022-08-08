const { serveLoginPage } = require('../handlers/serveLoginPage');
const { validateUserCreds } = require('../handlers/validateUser.js');

const loginRouter = (router, config) => {
  router.get('/', serveLoginPage(config));
  router.post('/', validateUserCreds(config));
  return router;
};

module.exports = { loginRouter };
