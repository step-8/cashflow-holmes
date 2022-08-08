const { serveRegisterPage } = require('../handlers/serveRegisterPage.js');
const { saveUserCredentials } = require('../handlers/saveUserCredentials.js');
const { validateUserInfo } = require('../handlers/validateUserInfo.js');

const registerRouter = (router, config) => {
  router.get('/', serveRegisterPage(config));
  router.post('/',
    validateUserInfo(config), saveUserCredentials(config),
    config.persistCredentials(config));
  return router;
};

module.exports = { registerRouter };
