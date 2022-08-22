const takeLoan = (req, res) => {
  const { game } = req;
  const { amount } = req.body;
  const { username } = req.session;
  const player = game.getPlayer(username);
  player.takeLoan(amount * 1000);
  const message = `took loan of ${amount * 1000}`;
  game.addLog(player, message);
  res.sendStatus(200);
};

const payLoan = (req, res) => {
  const { game } = req;
  const { amount } = req.body;
  const { username } = req.session;
  const player = game.getPlayer(username);
  let status = 406;

  if (player.payLoan(amount * 1000)) {
    status = 200;
    const message = `paid loan of ${amount * 1000}`;
    game.addLog(player, message);
  }

  res.sendStatus(status);
};

module.exports = { takeLoan, payLoan };
