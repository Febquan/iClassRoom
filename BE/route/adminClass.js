const express = require("express");
const {
  getAllClass,
  inactiveClass,
  deleteClass,
  getSpecificClass,
  changeUserRole,
  changeStudentId,
  postStudentExtraInfo,
} = require("./../controller/adminClassController");
const router = express.Router();

router.get("/getAllClass", getAllClass);
router.get("/getSpecificClass/:classId", getSpecificClass);
router.post("/inactiveClass", inactiveClass);
router.post("/deleteClass", deleteClass);
router.post("/changeUserRole", changeUserRole);
router.post("/changeStudentId", changeStudentId);
router.post("/postClassExtraInfo", postStudentExtraInfo);

module.exports = router;
