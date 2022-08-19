const { getDigest } = require('../utils/getDigest.js');

const serveGameDetails = (req, res) => {
  const { game } = req;
  const state = game.state;
  state.stateHash = getDigest(JSON.stringify(state));
  res.json(state);
};

module.exports = { serveGameDetails };
