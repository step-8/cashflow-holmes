const { GUEST_LOBBY } = require('../utils/pages.js');

const guestLobbyHandler = (req, res) => {
  const { game } = req;
  const { username } = req.session;
  const color = game.colors.pop();
  const player = { username, color };
  game.players.push(player);

  res.end(GUEST_LOBBY);
};

module.exports = { guestLobbyHandler };
