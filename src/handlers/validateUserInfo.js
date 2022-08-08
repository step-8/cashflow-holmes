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

module.exports = { validateUserInfo, userExists };
