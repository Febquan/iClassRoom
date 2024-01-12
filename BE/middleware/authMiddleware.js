const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function authMiddlewareAdmin(req, res, next) {
  const isAuthozized = req.session.user || req.user;

  if (!isAuthozized) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    return next(error);
  }
  next();
}

async function authMiddleware(req, res, next) {
  const isAuthozized = req.session.user || req.user;
  if (!isAuthozized) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    return next(error);
  }
  const resUser = await prisma.user.findUnique({
    where: {
      id: isAuthozized.id,
    },
  });
  if (!resUser) {
    const error = new Error("Unexist Account");
    error.statusCode = 401;
    return next(error);
  }
  next();
}
async function isLockAccount(req, res, next) {
  const user = req.session.user || req.user;
  const resUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });
  if (resUser.isLock) {
    const error = new Error("Account is locked by admin");
    error.statusCode = 401;
    return next(error);
  }
  next();
}

async function isAdmin(req, res, next) {
  const user = req.user || req.session.user;
  const isAdmin = await prisma.admin.findFirst({
    where: {
      id: user.id,
    },
  });
  if (!isAdmin) {
    const error = new Error("You are not Admin!");
    error.statusCode = 401;
    return next(error);
  }
  next();
}

module.exports = {
  authMiddlewareAdmin,
  authMiddleware,
  isAdmin,
  isLockAccount,
};
