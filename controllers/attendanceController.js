const attendanceModel = require("../models/attendanceModel.js");

async function getAllAttendance(req, res) {
  try {
    const records = await attendanceModel.getAll();
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance records" });
  }
}

async function createAttendance(req, res) {
  try {
    const { employee_id, date, status } = req.body;

    if (!employee_id || !date || !status) {
      return res.status(400).json({
        error: "employee_id, date, and status are required",
      });
    }

    const newRecord = await attendanceModel.create(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create attendance record" });
  }
}

module.exports = { getAllAttendance, createAttendance };
