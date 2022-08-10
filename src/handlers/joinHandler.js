const joinHandler = (req, res, next) => {
  const { gameID } = req.body;
  const { username } = req.session;

  if (req.game) {
    const { game } = req;
    if (game.isLobbyFull()) {
      res.sendStatus(423);
      return;
    }

    const player = game.state.players.find(player => username === player.username);
    if (player && player.role === 'host') {
      res.sendStatus(401);
      return;
    }

    if (game.isValidGameID(+gameID)) {
      req.session.gameID = gameID;
      res.sendStatus(200);
      return;
    }
  }
  res.sendStatus(400);
};

module.exports = { joinHandler };
