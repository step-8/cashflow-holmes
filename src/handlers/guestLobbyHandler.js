const { GUEST_LOBBY } = require('../utils/pages.js');

const guestLobbyHandler = (req, res) => {
  const { game } = req;
  const { username } = req.session;
  game.addPlayer(username);

  res.end(GUEST_LOBBY);
};

module.exports = { guestLobbyHandler };
