const protectedRoutes = (gameRouter) => (req, res, next) => {
  if (req.session.username) {
    gameRouter(req, res, next);
    return;
  }

  next();
};

module.exports = { protectedRoutes };
