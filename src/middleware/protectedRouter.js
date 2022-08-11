const protectedRoutes = (gameRouter) => (req, res, next) => {
  if (!req.session.username) {
    res.redirect('/login');
    return;
  }
  gameRouter(req, res, next);
};

module.exports = { protectedRoutes };
