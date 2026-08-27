const departmentModel = require("../models/departmentModel.js");

// Handles GET /departments
async function getAllDepartments(req, res) {
  try {
    const departments = await departmentModel.getAll();
    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
}

module.exports = { getAllDepartments };
