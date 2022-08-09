const joinHandler = (req, res, next) => {
  const { roomId } = req.body;

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
