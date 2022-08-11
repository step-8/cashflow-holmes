const { serveRegisterPage,
  saveUserCredentials,
  validateUserInfo,
  serveLoginPage,
  validateUserCreds } = require('../handlers/authHandlers.js');

const registerRouter = (router, config) => {
  router.get('/', serveRegisterPage(config));
  router.post('/',
    validateUserInfo(config), saveUserCredentials(config),
    config.persistCredentials(config));
  return router;
};

const loginRouter = (router, config) => {
  router.get('/', serveLoginPage(config));
  router.post('/', validateUserCreds(config));
  return router;
};

module.exports = { registerRouter, loginRouter };
