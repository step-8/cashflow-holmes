const serveProfession = (req, res) => {
  const { username } = req.session;
  const { players } = req.game.state;
  const player = players.find(player => player.username === username);
  if (!player) {
    res.sendStatus(400);
    return;
  }
  const { profession } = player;
  res.json(profession);
};

module.exports = { serveProfession };
