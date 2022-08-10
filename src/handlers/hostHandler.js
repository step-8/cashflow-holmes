const hostHandler = (req, res) => {
  res.redirect('/host-lobby');
};

module.exports = { hostHandler };
