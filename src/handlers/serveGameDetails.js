const { getDigest } = require('../utils/getDigest.js');

const serveGameDetails = (req, res) => {
  const { game } = req;
  const state = game.state;
  state.hash = getDigest(JSON.stringify(state));
  state.username = req.session.username;
  res.json(state);
};

const saveGameDetails = (DB) => (req, res) => {
  const { name } = req.params; // GET save/rat-race
  const { gameID } = req.session;
  const game = req.games.getGame(gameID);
  const state = game.state;
  DB.set(gameID + name, JSON.stringify(state))
    .then(() => DB.get(gameID + name))
    .then(state => res.json(state));
};

const loadGameDetails = (DB) => (req, res) => {
  const { name, gameID } = req.params; // GET load/1/rat-race
  const currentGame = req.session.gameID;
  const game = req.games.getGame(currentGame);
  DB.get(gameID + name)
    .then(state => {
      game.init(JSON.parse(state));
      res.json(state);
    });
};

module.exports = { serveGameDetails, saveGameDetails, loadGameDetails };
