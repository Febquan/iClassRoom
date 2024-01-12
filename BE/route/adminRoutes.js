const express = require("express");
const router = express.Router();
const adminAuthRoute = require("./adminAuth");
const adminclassRoute = require("./adminClass");
const adminaccountRoute = require("./adminAccount");
const {
  authMiddlewareAdmin,
  isAdmin,
} = require("../middleware/authMiddleware");

router.use("/auth", adminAuthRoute);
router.use("/class", authMiddlewareAdmin, isAdmin, adminclassRoute);
router.use("/account", authMiddlewareAdmin, isAdmin, adminaccountRoute);
module.exports = router;
