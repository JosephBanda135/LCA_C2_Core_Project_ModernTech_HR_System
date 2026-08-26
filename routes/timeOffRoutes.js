const express = require("express");
const router = express.Router();
const timeOffController = require("../controllers/timeOffController.js");
const authenticateToken = require("../middleware/authMiddleware.js");

router.get("/", authenticateToken, timeOffController.getAllRequests);
router.post("/", authenticateToken, timeOffController.createRequest);
router.put(
  "/:id/status",
  authenticateToken,
  timeOffController.updateRequestStatus,
);

module.exports = router;
