const joinHandler = (req, res, next) => {
  const { roomId } = req.body;
  const { gameId } = req;
  if (gameId === +roomId) {
    res.sendStatus(200);
    return;
  }
  res.sendStatus(400);
};
exports.joinHandler = joinHandler;
