const expressSession = require('express-session');

const config = {
  PUBLIC: './public',
  REGISTER_PAGE: './views/register.html',
  LOGIN_PAGE: './views/login.html',
  CRED_PATH: './test/test.json',
  SECRET: 'test',
  persistCredentials: () => (req, res) => res.redirect('/')
};

const session = expressSession({
  secret: config.SECRET, resave: false, saveUninitialized: false
});

module.exports = { testDeps: { config, session } };
