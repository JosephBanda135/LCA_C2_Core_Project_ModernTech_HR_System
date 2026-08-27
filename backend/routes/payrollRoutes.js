const express = require("express");
const router = express.Router();
const payrollController = require("../controllers/payrollController.js");
const authenticateToken = require("../middleware/authMiddleware.js");

router.get("/", authenticateToken, payrollController.getAllPayroll);
router.post("/", authenticateToken, payrollController.createPayroll);

module.exports = router;
