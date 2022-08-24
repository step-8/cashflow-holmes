const { Dice, RiggedDice } = require('../models/die.js');
const { HOST_LOBBY } = require('../utils/pages.js');


const hostLobbyHandler = (diceValues) => (req, res) => {
  const { username, gameID } = req.session;
  let hostHtml = HOST_LOBBY
    .replace('__USERNAME__', username);

  if (gameID) {
    hostHtml = hostHtml.replace('__GAME_ID__', gameID);
    res.send(hostHtml);
    return;
  }
  let dice = new Dice(2, 6);
  if (diceValues) {
    dice = new RiggedDice(JSON.parse(diceValues));
  }

  req.games.newGame(username, dice);
  const { latestGameID } = req.games;
  req.session.gameID = latestGameID;
  const game = req.games.getGame(latestGameID);

  hostHtml = hostHtml.replace('__GAME_ID__', latestGameID);
  res.send(hostHtml);
};

module.exports = { hostLobbyHandler };
