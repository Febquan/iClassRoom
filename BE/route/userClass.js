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
  postComment,
  changeStudentId,
  postStudentExtraInfo,
  checkIsInClass,
  checkIsClassOwner,
  changeMyStudentId,
  getClassGrade,
  checkIsTeacher,
  checkIsStudent,
  postUpdateGrade,
  getStudentGrade,
} = require("../controller/userClassController");

const router = express.Router();
router.post("/createClass", createClass);
router.get("/getAllClass/:userId", getAllUserClass);
router.get("/getClassInviteInfo/:hashedClassId", getClassInviteInfo);
router.get("/getStudentInviteLink/:classId", getStudentInviteLink);
router.get("/getTeacherInviteLink/:classId", getTeacherInviteLink);
router.post("/acceptInvite", acceptInvite);
router.get("/getClassContent/:classId", checkIsInClass, getClassContent);
router.post(
  "/createClassPost",
  HandleMulterError,
  checkIsInClass,
  createClassPost
);
router.post("/presignedS3Url", getS3PresignedUrlControler);
router.post("/emailInvite", checkIsInClass, inviteEmails);
router.post("/leaveClass", checkIsInClass, leaveClass);
router.post("/changeUserRole", checkIsClassOwner, changeUserRole);
router.post("/changeStudentId", checkIsClassOwner, changeStudentId);
router.post("/postComment", checkIsInClass, postComment);
router.post("/changeMyStudentId", checkIsInClass, changeMyStudentId);
router.post("/postClassExtraInfo", checkIsClassOwner, postStudentExtraInfo);
router.get("/getClassGrade/:classId", checkIsTeacher, getClassGrade);
router.post(
  "/postUpdateGrade",
  checkIsTeacher,
  checkIsClassOwner,
  postUpdateGrade
);
router.get(
  "/getStudentGrade/:classId/:userId",
  checkIsStudent,
  getStudentGrade
);

module.exports = router;
