const serveProfession = (req, res) => {
  const { username } = req.session;
  const { game } = req;

  const { players } = game.state;
  const player = players.find(player => player.username === username);

  if (!player) {
    res.sendStatus(400);
    return;
  }

  const { profession } = player;
  res.json(profession);
};

module.exports = { serveProfession };
