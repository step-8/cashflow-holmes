const { HOST_LOBBY } = require('../utils/pages.js');

const createGameID = () => {
  const date = new Date();
  return date.getTime() % 10000;
};

const hostLobbyHandler = (req, res) => {
  const gameID = createGameID();
  req.game.assignGameID(gameID);

  const { username } = req.session;
  req.game.addPlayer(username);

  res.send(HOST_LOBBY);
};

module.exports = { hostLobbyHandler };
