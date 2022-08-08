const hostHandler = (req, res) => {
  if (!req.session.username) {
    res.redirect('/login');
    return;
  }

  res.redirect('/host-lobby');
};

module.exports = { hostHandler };
