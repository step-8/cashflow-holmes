const serveMainMenu = (req, res) => {
  if (!req.session.username) {
    res.redirect('/login');
    return;
  }

  res.end('ok');
};

module.exports = { serveMainMenu };