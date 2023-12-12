const express = require("express");
const {
  createClass,
  getAllUserClass,
  acceptInvite,
  getStudentInviteLink,
  getTeacherInviteLink,
  getClassInviteInfo,
  getClassContent,
  createClassPost,
  HandleMulterError,
  getS3PresignedUrlControler,
  inviteEmails,
  leaveClass,
  changeUserRole,
} = require("../controller/userClassController");

const router = express.Router();
router.post("/createClass", createClass);
router.get("/getAllClass/:userId", getAllUserClass);
router.get("/getClassInviteInfo/:hashedClassId", getClassInviteInfo);
router.get("/getStudentInviteLink/:classId", getStudentInviteLink);
router.get("/getTeacherInviteLink/:classId", getTeacherInviteLink);
router.get("/getClassContent/:classId", getClassContent);
router.post("/acceptInvite", acceptInvite);
router.post("/createClassPost", HandleMulterError, createClassPost);
router.post("/presignedS3Url", getS3PresignedUrlControler);
router.post("/emailInvite", inviteEmails);
router.post("/leaveClass", leaveClass);
router.post("/changeUserRole", changeUserRole);

module.exports = router;
