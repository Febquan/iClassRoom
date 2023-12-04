const express = require("express");
const {
  createClass,
  getAllUserClass,
  acceptInvite,
  getStudentInviteLink,
  getTeacherInviteLink,
  getClassInviteInfo,
  getClassPost,
} = require("../controller/userClassController");

const router = express.Router();

router.post("/createClass", createClass);
router.get("/getAllClass/:userId", getAllUserClass);
router.get("/getClassInviteInfo/:hashedClassId", getClassInviteInfo);
router.get("/getStudentInviteLink/:classId", getStudentInviteLink);
router.get("/getTeacherInviteLink/:classId", getTeacherInviteLink);
router.get("/getClassPost/:classId", getClassPost);
router.post("/acceptInvite", acceptInvite);
module.exports = router;
