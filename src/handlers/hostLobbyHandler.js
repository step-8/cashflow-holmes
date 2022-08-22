const { HOST_LOBBY } = require('../utils/pages.js');

const hostLobbyHandler = (req, res) => {
  const { username, gameID } = req.session;
  let hostHtml = HOST_LOBBY
    .replace('__USERNAME__', username);

  if (gameID) {
    hostHtml = hostHtml.replace('__GAME_ID__', gameID);
    res.send(hostHtml);
    return;
  }

  req.games.newGame(username);
  const { latestGameID } = req.games;
  req.session.gameID = latestGameID;
  const game = req.games.getGame(latestGameID);

  hostHtml = hostHtml.replace('__GAME_ID__', latestGameID);
  res.send(hostHtml);
};

module.exports = { hostLobbyHandler };
