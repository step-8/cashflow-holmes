const joinHandler = (req, res, next) => {
  const { gameID: roomId } = req.body;

  console.log(req.session);
  console.log(!!req.game);
  if (req.game) {
    const { game } = req;
    if (game.isLobbyFull()) {
      res.sendStatus(423);
      return;
    }

    if (game.isValidGameID(+roomId)) {
      res.sendStatus(200);
      return;
    }
  }
  res.sendStatus(400);
};

module.exports = { joinHandler };
