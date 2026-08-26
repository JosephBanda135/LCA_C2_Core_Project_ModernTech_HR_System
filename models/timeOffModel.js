const pool = require("../config/db.js");

// Get all time-off requests, joined with the employee's name, newest first
async function getAll() {
  const [rows] = await pool.query(
    `SELECT time_off_requests.*, employees.first_name, employees.last_name
     FROM time_off_requests
     INNER JOIN employees ON time_off_requests.employee_id = employees.id
     ORDER BY time_off_requests.created_at DESC`,
  );
  return rows;
}

// Get one request by id, joined with the employee's name
async function getById(id) {
  const [rows] = await pool.query(
    `SELECT time_off_requests.*, employees.first_name, employees.last_name
     FROM time_off_requests
     INNER JOIN employees ON time_off_requests.employee_id = employees.id
     WHERE time_off_requests.id = ?`,
    [id],
  );
  return rows[0];
}

// Create a new request.
async function create(request) {
  const { employee_id, start_date, end_date, reason } = request;

  const [result] = await pool.query(
    `INSERT INTO time_off_requests (employee_id, start_date, end_date, reason)
     VALUES (?, ?, ?, ?)`,
    [employee_id, start_date, end_date, reason],
  );

  return getById(result.insertId);
}

// Only changes the status column (used for approve/reject).
async function updateStatus(id, status) {
  await pool.query("UPDATE time_off_requests SET status = ? WHERE id = ?", [
    status,
    id,
  ]);
  return getById(id);
}

module.exports = { getAll, getById, create, updateStatus };
