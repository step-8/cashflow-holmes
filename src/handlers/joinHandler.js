const joinHandler = (req, res, next) => {
  const { gameID } = req.body;

  if (req.game) {
    const { game } = req;
    if (game.isLobbyFull()) {
      res.sendStatus(423);
      return;
    }

    if (game.isValidGameID(+gameID)) {
      res.sendStatus(200);
      return;
    }
  }
  res.sendStatus(400);
};

module.exports = { joinHandler };
