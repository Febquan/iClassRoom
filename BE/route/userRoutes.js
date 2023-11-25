const express = require("express");
const router = express.Router();
const userAuthRoute = require("./userAuth");

router.use("/auth", userAuthRoute);

module.exports = router;
