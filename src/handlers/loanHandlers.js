const takeLoan = (req, res) => {
  const { game } = req;
  const { amount } = req.body;
  const { username } = req.session;

  const player = game.getPlayer(username);
  player.takeLoan(amount);

  game.addLog(username, `took loan of $${amount}`);
  res.sendStatus(200);
};

const payLoan = (req, res) => {
  const { game } = req;
  const { amount } = req.body;
  const { username } = req.session;
  const player = game.getPlayer(username);
  let status = 406;

  if (player.payLoan(amount)) {
    status = 200;
    game.addLog(username, `paid loan of $${amount}`);
  }

  res.sendStatus(status);
};

module.exports = { takeLoan, payLoan };
