const { MAIN_MENU_PAGE } = require('../utils/pages.js');

const serveMainMenu = (req, res) => {
  if (!req.session.username) {
    res.redirect('/login');
    return;
  }

  res.send(MAIN_MENU_PAGE);
};

module.exports = { serveMainMenu };
