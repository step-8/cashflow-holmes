const fs = require('fs');
const { getDigest } = require('../utils/getDigest.js');

const saveUserCredentials = (config) => (req, res, next) => {
  const { credentials } = config;
  const { username: usernameRaw, password: passwordRaw } = req.body;
  
  const userId = new Date().getTime();
  const username = usernameRaw.toLowerCase();
  const password = getDigest(passwordRaw);
  
  credentials[userId] = { userId, username, password };
  req.session.username = username;
  next();
};

const persistCredentials = (config) => (req, res) => {
  const { CRED_PATH, credentials } = config;
  fs.writeFileSync(CRED_PATH, JSON.stringify(credentials), 'utf8');
  res.redirect('/');
};

module.exports = { saveUserCredentials, persistCredentials };
