const express = require("express");
const router = express.Router();
const userAuthRoute = require("./userAuth");
const userclassRoute = require("./userClass");
const authMiddleware = require("./../middleware/authMiddleware");

router.use("/auth", userAuthRoute);
router.use("/class", authMiddleware, userclassRoute);
module.exports = router;
