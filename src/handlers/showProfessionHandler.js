const { PROFESSION_CARD } = require('../utils/pages.js');

const showProfessionHandler = (req, res) => {
  res.send(PROFESSION_CARD);
};

module.exports = { showProfessionHandler };
