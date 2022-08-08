const hostHandler = (req, res) => {
  if (!req.session.username) {
    res.sendStatus(401);
    return;
  }

  res.redirect('/host-lobby');
};

module.exports = { hostHandler };
