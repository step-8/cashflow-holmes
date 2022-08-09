const { Game } = require('../models/game.js');
const { HOST_LOBBY } = require('../utils/pages.js');

const createGameID = () => {
  const date = new Date();
  return date.getTime() % 10000;
};

const hostLobbyHandler = (req, res) => {
  const colors = ['blue', 'green', 'yellow', 'pink', 'violet', 'orange'];
  const professions = [
    'doctor', 'police', 'pilot', 'janitor', 'lawyer', 'mechanic'
  ];
  const gameID = createGameID();
  const game = new Game(gameID, colors, professions);
  const lobbyPage = HOST_LOBBY.replace('__room_id__', gameID);

  const { username } = req.session;
  game.addPlayer(username);
  req.game = game;

  res.send(lobbyPage);
};

module.exports = { hostLobbyHandler };
