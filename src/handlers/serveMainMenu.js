const { MAIN_MENU_PAGE } = require('../utils/pages.js');

const serveMainMenu = (req, res) => {
  res.send(MAIN_MENU_PAGE);
};

module.exports = { serveMainMenu };
