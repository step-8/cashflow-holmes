const takeLoan = (req, res) => {
  const { game } = req;
  const { amount } = req.body;
  const { username } = req.session;
  game.takeLoan(username, amount);
  res.sendStatus(200);
};

const payLoan = (req, res) => {
  const { game } = req;
  const { amount } = req.body;
  const { username } = req.session;

  let status = 406;
  if (game.payLoan(username, amount)) {
    status = 200;
  }

  res.sendStatus(status);
};

module.exports = { takeLoan, payLoan };
