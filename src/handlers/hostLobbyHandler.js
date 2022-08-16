const { HOST_LOBBY } = require('../utils/pages.js');

const hostLobbyHandler = (req, res) => {
  if (req.session.gameID) {
    const hostHtml = HOST_LOBBY.replace('__GAME_ID__', req.session.gameID);
    res.send(hostHtml);
    res.end();
    return;
  }

  req.games.newGame();
  const gameID = req.games.latestGameID;

  req.session.gameID = gameID;

  const game = req.games.getGame(gameID);

  const username = req.session.username;
  game.addPlayer(username, 'host');
  const hostHtml = HOST_LOBBY.replace('__GAME_ID__', gameID);
  res.send(hostHtml);
  res.end();
};

module.exports = { hostLobbyHandler };
