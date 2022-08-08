const joinLobbyHandler = (req, res) => {
  const { game } = req;
  const { username } = req.session;
  const color = game.colors.pop();
  const player = { username, color };
  game.players.push(player);
  res.json(game);
};

module.exports = { joinLobbyHandler };
