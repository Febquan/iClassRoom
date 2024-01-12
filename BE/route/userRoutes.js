const express = require("express");
const router = express.Router();
const userAuthRoute = require("./userAuth");
const userclassRoute = require("./userClass");
const {
  authMiddleware,
  isLockAccount,
} = require("./../middleware/authMiddleware");

router.use("/auth", userAuthRoute);
router.use("/class", authMiddleware, isLockAccount, userclassRoute);
module.exports = router;
