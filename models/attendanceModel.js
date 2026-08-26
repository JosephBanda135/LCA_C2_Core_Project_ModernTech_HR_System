const pool = require("../config/db.js");

// Get all attendance records, joined with employee name
async function getAll() {
  const [rows] = await pool.query(
    `SELECT attendance.*, employees.first_name, employees.last_name
     FROM attendance
     INNER JOIN employees ON attendance.employee_id = employees.id
     ORDER BY attendance.date DESC`,
  );
  return rows;
}

// Create a new attendance record for one employee on one date
async function create(record) {
  const { employee_id, date, status } = record;

  const [result] = await pool.query(
    "INSERT INTO attendance (employee_id, date, status) VALUES (?, ?, ?)",
    [employee_id, date, status],
  );

  const [rows] = await pool.query(
    `SELECT attendance.*, employees.first_name, employees.last_name
     FROM attendance
     INNER JOIN employees ON attendance.employee_id = employees.id
     WHERE attendance.id = ?`,
    [result.insertId],
  );

  return rows[0];
}

module.exports = { getAll, create };
