const leaveLobbyHandler = (req, res) => {
  const { game } = req;
  const { username } = req.session;

  game.removePlayer(username);
  req.session.gameID = null;
  res.redirect('/');
};

module.exports = { leaveLobbyHandler };
