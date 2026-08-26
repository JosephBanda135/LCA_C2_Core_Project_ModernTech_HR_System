const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController.js");
const authenticateToken = require("../middleware/authMiddleware.js");

router.get("/", authenticateToken, attendanceController.getAllAttendance);
router.post("/", authenticateToken, attendanceController.createAttendance);

module.exports = router;
