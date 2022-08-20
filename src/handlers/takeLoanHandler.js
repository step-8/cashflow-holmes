const takeLoan = (req, res) => {
  const { game } = req;
  const { amount } = req.body;
  const { username } = req.session;
  const player = game.getPlayer(username);
  player.takeLoan(amount * 1000);
  res.end();
};

module.exports = { takeLoan };
