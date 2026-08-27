const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController.js");
const authenticateToken = require("../middleware/authMiddleware.js");

// every route below requires a valid login token
router.get("/", authenticateToken, employeeController.getAllEmployees);
router.post("/", authenticateToken, employeeController.createEmployee);
router.put("/:id", authenticateToken, employeeController.updateEmployee);
router.delete("/:id", authenticateToken, employeeController.deleteEmployee);

module.exports = router;
