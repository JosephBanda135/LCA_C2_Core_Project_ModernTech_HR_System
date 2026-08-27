const timeOffModel = require("../models/timeOffModel.js");

// Handles GET /time-off
async function getAllRequests(req, res) {
  try {
    const requests = await timeOffModel.getAll();
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch time-off requests" });
  }
}

// Handles POST /time-off - employee submits a new request
async function createRequest(req, res) {
  try {
    const { employee_id, start_date, end_date, reason } = req.body;

    if (!employee_id || !start_date || !end_date) {
      return res.status(400).json({
        error: "employee_id, start_date, and end_date are required",
      });
    }

    const newRequest = await timeOffModel.create(req.body);
    res.status(201).json(newRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create time-off request" });
  }
}

// Handles PUT /time-off/:id/status - HR approves or rejects a request
async function updateRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // only these two values are valid decisions HR can make
    const allowedStatuses = ["Approved", "Rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "status must be either 'Approved' or 'Rejected'",
      });
    }

    const existing = await timeOffModel.getById(id);
    if (!existing) {
      return res.status(404).json({ error: "Time-off request not found" });
    }

    const updated = await timeOffModel.updateStatus(id, status);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update request status" });
  }
}

module.exports = { getAllRequests, createRequest, updateRequestStatus };
