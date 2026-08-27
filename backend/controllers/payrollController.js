const payrollModel = require("../models/payrollModel.js");

async function getAllPayroll(req, res) {
  try {
    const records = await payrollModel.getAll();
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch payroll records" });
  }
}

async function createPayroll(req, res) {
  try {
    const { employee_id, hourly_rate, hours_worked, pay_period } = req.body;

    if (!employee_id || !hourly_rate || !hours_worked || !pay_period) {
      return res.status(400).json({
        error:
          "employee_id, hourly_rate, hours_worked, and pay_period are required",
      });
    }

    const newRecord = await payrollModel.create(req.body);
    res.status(201).json(newRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create payroll record" });
  }
}

module.exports = { getAllPayroll, createPayroll };
