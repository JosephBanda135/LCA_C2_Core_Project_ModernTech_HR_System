const pool = require("../config/db.js");

// Get all payroll records, joined with employee name
async function getAll() {
  const [rows] = await pool.query(
    `SELECT payroll.*, employees.first_name, employees.last_name
     FROM payroll
     INNER JOIN employees ON payroll.employee_id = employees.id
     ORDER BY payroll.generated_at DESC`,
  );
  return rows;
}

// Create a new payroll record for one employee
async function create(record) {
  const { employee_id, hourly_rate, hours_worked, pay_period } = record;

  const [result] = await pool.query(
    `INSERT INTO payroll (employee_id, hourly_rate, hours_worked, pay_period)
     VALUES (?, ?, ?, ?)`,
    [employee_id, hourly_rate, hours_worked, pay_period],
  );

  const [rows] = await pool.query(
    `SELECT payroll.*, employees.first_name, employees.last_name
     FROM payroll
     INNER JOIN employees ON payroll.employee_id = employees.id
     WHERE payroll.id = ?`,
    [result.insertId],
  );

  return rows[0];
}

module.exports = { getAll, create };
