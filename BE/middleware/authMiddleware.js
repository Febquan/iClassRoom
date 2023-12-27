function authMiddleware(req, res, next) {
  const isAuthozized = req.session.user || req.user;
  if (!isAuthozized) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    return next(error);
  }
  next();
}

module.exports = authMiddleware;
