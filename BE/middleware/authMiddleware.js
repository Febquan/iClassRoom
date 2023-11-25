function authMiddleware(req, res, next) {
  const isAuthozized = req.session.user || req.user;
  if (!isAuthozized) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
  next();
}

module.exports = authMiddleware;
