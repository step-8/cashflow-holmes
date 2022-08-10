const { HOST_LOBBY } = require('../utils/pages.js');

const createGameID = () => {
  const date = new Date();
  return date.getTime() % 10000;
};

const hostLobbyHandler = (req, res) => {
  if (req.session.gameID) {
    res.send(HOST_LOBBY);
    res.end();
    return;
  }

  const gameID = createGameID();
  req.session.gameID = gameID;

  req.games.newGame(gameID);
  const game = req.games.getGame(gameID);

  const username = req.session.username;
  game.addPlayer(username, 'host');

  res.send(HOST_LOBBY);
  res.end();
};

module.exports = { hostLobbyHandler };
