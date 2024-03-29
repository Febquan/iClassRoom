const express = require("express");
const passport = require("passport");
const {
  signupController,
  loginController,
  autoLoginController,
  LogOutController,
  changeInfoController,
  changePasswordController,
  changePasswordEmailController,
  verify,
  sendEmailChangePasswordController,
  changeProfile,
} = require("../controller/userAuthController");
const {
  authMiddleware,
  isLockAccount,
} = require("./../middleware/authMiddleware");
const HandleMulterError = require("../middleware/handleMulter");
const router = express.Router();

router.post("/signup", signupController);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.FRONTEND_URL + "/",
    failureRedirect: process.env.FRONTEND_URL + "/unauthorized",
  })
);
router.get("/facebook", passport.authenticate("facebook"));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: process.env.FRONTEND_URL + "/",
    failureRedirect: process.env.FRONTEND_URL + "/unauthorized",
  })
);
router.post("/login", loginController);
router.post("/logout", LogOutController);
router.post(
  "/changepass",
  authMiddleware,
  isLockAccount,
  changePasswordController
);
router.get("/autologin", autoLoginController);
router.get("/verify", verify);
router.post("/sendEmailChangePassword", sendEmailChangePasswordController);
router.post(
  "/changePasswordEmail/:emailToken",
  isLockAccount,
  changePasswordEmailController
);

router.post(
  "/changeinfo",
  authMiddleware,
  isLockAccount,
  HandleMulterError,
  changeProfile
);

module.exports = router;
