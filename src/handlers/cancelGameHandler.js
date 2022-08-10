const cancelGameHandler = (req, res) => {
  const { game } = req;
  game.cancel();
  req.session.gameID = null;
  res.redirect('/');
  return;
};

module.exports = { cancelGameHandler };
