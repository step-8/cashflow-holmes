const joinHandler = (req, res, next) => {
  const { gameID } = req.body;
  const { username } = req.session;

  const lobby = req.games.getGame(gameID);
  if (!lobby) {
    res.sendStatus(400);
    return;
  }

  if (lobby.isFull()) {
    res.sendStatus(423);
    return;
  }

  const player = lobby.state.players.find(
    player => player.username === username
  );

  if (player && player.role === 'host') {
    res.sendStatus(401);
    return;
  }

  if (lobby.isValid(+gameID) && lobby.state.status !== 'cancelled') {
    req.session.gameID = gameID;
    res.sendStatus(200);
    return;
  }
};

module.exports = { joinHandler };
