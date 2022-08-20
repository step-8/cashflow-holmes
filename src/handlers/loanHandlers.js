const takeLoan = (req, res) => {
  const { game } = req;
  const { amount } = req.body;
  const { username } = req.session;
  const player = game.getPlayer(username);
  player.takeLoan(amount * 1000);
  res.sendStatus(200);
};

const payLoan = (req, res) => {
  const { game } = req;
  const { amount } = req.body;
  const { username } = req.session;
  const player = game.getPlayer(username);
  const status = player.payLoan(amount * 1000) ? 200 : 406;
  res.sendStatus(status);
};

module.exports = { takeLoan, payLoan };
