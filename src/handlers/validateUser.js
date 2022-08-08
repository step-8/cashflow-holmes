const { getDigest } = require('../utils/getDigest.js');
const { userExists } = require('./validateUserInfo.js');

const validateUserCreds = ({ credentials }) => (req, res, next) => {
  const { username: usernameRaw, password: passwordRaw } = req.body;
  const username = usernameRaw.toLowerCase();
  
  const userData = userExists(credentials, username);
  const password = getDigest(passwordRaw);

  if (userData && userData.password === password) {
    req.session.username = username;
    next();
    return;
  }
  
  res.cookie('status', 'creds invalid');
  res.redirect('/login');
};

module.exports = { validateUserCreds };
