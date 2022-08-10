const cancelGameHandler = (req, res) => {
  const { game } = req;
  game.cancel();
  req.session.gameID = null;
  res.redirect('/');
  return;
};

const removeGameIdHandler = (req, res) => {
  req.session.gameID = null;
  res.end();
};

module.exports = { cancelGameHandler, removeGameIdHandler};
