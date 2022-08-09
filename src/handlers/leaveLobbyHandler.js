const leaveLobbyHandler = (req, res) => {
  const { game } = req;
  const { username } = req.session;

  game.removePlayer(username);
  res.redirect('/');
};

module.exports = { leaveLobbyHandler };
