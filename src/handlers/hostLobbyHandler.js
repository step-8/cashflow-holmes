const { HOST_LOBBY } = require('../utils/pages.js');

const hostLobbyHandler = (req, res) => {
  const { username, gameID } = req.session;
  let hostHtml = HOST_LOBBY
    .replace('__USERNAME__', username);

  if (req.session.gameID) {
    hostHtml = hostHtml.replace('__GAME_ID__', gameID);
    res.send(hostHtml);
    res.end();
    return;
  }

  req.games.newGame();
  const { latestGameID } = req.games;
  req.session.gameID = latestGameID;
  const game = req.games.getGame(latestGameID);
  game.addPlayer(username, 'host');

  hostHtml = hostHtml.replace('__GAME_ID__', latestGameID);
  res.send(hostHtml);
  res.end();
};

module.exports = { hostLobbyHandler };
