const fs = require('fs');

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

module.exports = { serveLoginPage };
