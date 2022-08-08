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

module.exports = {serveRegisterPage};
