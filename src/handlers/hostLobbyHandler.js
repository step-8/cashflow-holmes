const { HOST_LOBBY } = require('../utils/pages.js');

const createGameID = () => {
  const date = new Date();
  return date.getTime() % 10000;
};

const hostLobbyHandler = (req, res) => {
  if (req.session.gameID) {
    res.end(HOST_LOBBY);
    return;
  }

  const gameID = createGameID();
  req.game.assignGameID(gameID);

  const { username } = req.session;
  req.game.addPlayer(username, 'host');

  req.session.gameID = gameID;
  res.end(HOST_LOBBY);
};

module.exports = { hostLobbyHandler };
