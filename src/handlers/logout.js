const logoutHandler = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

module.exports = { logoutHandler };
