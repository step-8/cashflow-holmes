const joinHandler = (req, res, next) => {
  const { roomId } = req.body;
  const { gameId, players } = req.game;
  if (players.length >= 6) {
    res.sendStatus(423);
    return;
  }

  if (gameId === +roomId) {
    res.sendStatus(200);
    return;
  }
  res.sendStatus(400);
};

module.exports = { joinHandler };
