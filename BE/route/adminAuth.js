const express = require("express");
const {
  loginController,
  autoLoginController,
  LogOutController,
  changePasswordController,
  changePasswordEmailController,
  sendEmailChangePasswordController,
} = require("../controller/adminAuthController");
const { authMiddlewareAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/login", loginController);
router.post("/logout", LogOutController);
router.post("/changepass", authMiddlewareAdmin, changePasswordController);
router.get("/autologin", autoLoginController);
router.post("/sendEmailChangePassword", sendEmailChangePasswordController);
router.post("/changePasswordEmail/:emailToken", changePasswordEmailController);

module.exports = router;
