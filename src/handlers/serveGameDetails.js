const fs = require('fs');

const { getDigest } = require('../utils/getDigest.js');

const serveGameDetails = (req, res) => {
  const { game } = req;
  const state = game.state;
  state.hash = getDigest(JSON.stringify(state));
  state.username = req.session.username;
  res.json(state);
};

const saveGameDetails = (gamesFile) => (req, res) => {
  const { name, gameID } = req.params;// GET save/1/rat-race
  const game = req.games.getGame(gameID);
  const state = game.state;
  const games = JSON.parse(fs.readFileSync(gamesFile, 'utf-8'));
  games[gameID] = games[gameID] || {};
  games[gameID][name] = state;
  fs.writeFileSync(gamesFile, JSON.stringify(games));
  res.json(games[gameID][name]);
};

const loadGameDetails = (gamesFile) => (req, res) => {
  const { name, gameID } = req.params;// GET load/1/rat-race
  const game = req.games.getGame(gameID);
  const games = JSON.parse(fs.readFileSync(gamesFile, 'utf-8'));
  const state = games[gameID][name];
  game.init(state);
  res.json(games[gameID][name]);
};

module.exports = { serveGameDetails, saveGameDetails, loadGameDetails };
