const { getDigest } = require('../utils/getDigest.js');
const fs = require('fs');

const serveRegisterPage = (config) => (req, res) => {
  const { REGISTER_PAGE } = config;
  const pageTemplate = fs.readFileSync(REGISTER_PAGE, 'utf8');
  res.cookie('status', 'ok;maxAge=0');
  
  if (req.cookies.status === 'username not available') {
    const page = pageTemplate.replace('__MESSAGE__', 'Username not available');
    res.send(page);
    return;
  }
  
  const page = pageTemplate.replace('__MESSAGE__', '');
  res.send(page);
};

const userExists = (credentials, username) => {
  return Object.values(credentials).find(cred => cred.username === username);
};

const validateUserInfo = ({ credentials }) => (req, res, next) => {
  const { username: usernameRaw } = req.body;
  const username = usernameRaw.toLowerCase();
  
  if (userExists(credentials, username)) {
    res.cookie('status', 'username not available');
    res.redirect('/register');
    return;
  }

  next();
};

const validateUserCreds = ({ credentials }) => (req, res, next) => {
  const { username: usernameRaw, password: passwordRaw } = req.body;
  const username = usernameRaw.toLowerCase();

  const userData = userExists(credentials, username);
  const password = getDigest(passwordRaw);

  if (userData && userData.password === password) {
    req.session.username = username;
    res.redirect('/');
    return;
  }

  res.cookie('status', 'creds invalid');
  res.redirect('/login');
};

const serveLoginPage = (config) => (req, res) => {
  const { LOGIN_PAGE } = config;
  const pageTemplate = fs.readFileSync(LOGIN_PAGE, 'utf8');
  res.cookie('status', 'ok;maxAge=0');
  
  if (req.cookies.status === 'creds invalid') {
    const page = pageTemplate.replace('__MESSAGE__', 'Invalid credentials');
    res.send(page);
    return;
  }
  
  const page = pageTemplate.replace('__MESSAGE__', '');
  res.send(page);
};

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

const authenticate = (req, res, next) => {
  if (req.session.username) {
    res.redirect('/');
    return;
  }
  next();
};

module.exports = {
  serveRegisterPage,
  validateUserCreds,
  validateUserInfo,
  serveLoginPage,
  saveUserCredentials,
  persistCredentials,
  authenticate
};
