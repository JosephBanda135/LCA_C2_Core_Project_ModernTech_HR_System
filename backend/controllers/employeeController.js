const employeeModel = require("../models/employeeModel.js");

// Handles GET /employees - returns every employee with their department name
async function getAllEmployees(req, res) {
  try {
    const employees = await employeeModel.getAll();
    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
}

// Handles POST /employees - creates a new employee record
async function createEmployee(req, res) {
  try {
    const { first_name, last_name, email, department_id, salary } = req.body;

    // basic required-field validation before touching the database
    if (!first_name || !last_name || !email || !department_id || !salary) {
      return res.status(400).json({
        error:
          "first_name, last_name, email, department_id, and salary are required",
      });
    }

    // pass the whole body through - the model knows which fields to use
    const newEmployee = await employeeModel.create(req.body);
    res.status(201).json(newEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create employee" });
  }
}

// Handles PUT /employees/:id - updates an existing employee
async function updateEmployee(req, res) {
  try {
    const { id } = req.params;

    // check the employee actually exists before trying to update it
    const existing = await employeeModel.getById(id);
    if (!existing) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const updated = await employeeModel.update(id, req.body);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update employee" });
  }
}

// Handles DELETE /employees/:id - removes an employee
async function deleteEmployee(req, res) {
  try {
    const { id } = req.params;

    // same existence check as update, so we don't  "delete" nothing
    const existing = await employeeModel.getById(id);
    if (!existing) {
      return res.status(404).json({ error: "Employee not found" });
    }

    await employeeModel.remove(id);
    res.json({ message: "Employee deleted successfully", id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete employee" });
  }
}

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
