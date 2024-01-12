const express = require("express");
const {
  getAllUser,
  deleteUser,
  lockUser,
} = require("./../controller/adminAccountController");
const router = express.Router();

router.get("/getAllUser", getAllUser);
router.post("/lockUser", lockUser);
router.post("/deleteUser", deleteUser);

module.exports = router;
