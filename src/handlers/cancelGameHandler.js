const cancelGameHandler = (req, res) => {
  const { gameID } = req.session;
  const { game } = req;
  const gameDetails = game.state;
  if (gameDetails.gameID === gameID) {
    game.cancel();
    req.session.gameID = null;
    res.redirect('/');
    return;
  }
  res.sendStatus(400);
};

module.exports = { cancelGameHandler };
