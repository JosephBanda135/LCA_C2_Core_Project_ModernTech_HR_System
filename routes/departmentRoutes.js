const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController.js");
const authenticateToken = require("../middleware/authMiddleware.js");

// still requires login, since it's part of the protected HR system
router.get("/", authenticateToken, departmentController.getAllDepartments);

module.exports = router;
