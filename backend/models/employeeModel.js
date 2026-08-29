const pool = require("../config/db.js");

// Get all employees, joined with their department name
async function getAll() {
  const [rows] = await pool.query(
    `SELECT employees.*, departments.name AS department_name
     FROM employees
     INNER JOIN departments ON employees.department_id = departments.id
     ORDER BY employees.id`,
  );
  return rows;
}

// Get one employee by id, joined with their department name
async function getById(id) {
  const [rows] = await pool.query(
    `SELECT employees.*, departments.name AS department_name
     FROM employees
     INNER JOIN departments ON employees.department_id = departments.id
     WHERE employees.id = ?`,
    [id],
  );
  return rows[0];
}

// Insert a new employee, then return the full saved record (create)
async function create(employee) {
  const {
    first_name,
    last_name,
    email,
    job_title,
    department_id,
    salary,
    hourly_rate,
    hours_worked,
    phone,
    hire_date,
  } = employee;

  const [result] = await pool.query(
    `INSERT INTO employees
     (first_name, last_name, email, job_title, department_id, salary, hourly_rate, hours_worked, phone, hire_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      first_name,
      last_name,
      email,
      job_title,
      department_id,
      salary,
      hourly_rate,
      hours_worked,
      phone,
      hire_date,
    ],
  );

  return getById(result.insertId);
}

// Update an existing employee, then return the updated record
async function update(id, employee) {
  const {
    first_name,
    last_name,
    email,
    job_title,
    department_id,
    salary,
    hourly_rate,
    hours_worked,
    phone,
    hire_date,
    status,
  } = employee;

  await pool.query(
    `UPDATE employees SET
     first_name = ?, last_name = ?, email = ?, job_title = ?, department_id = ?,
     salary = ?, hourly_rate = ?, hours_worked = ?, phone = ?, hire_date = ?, status = ?
     WHERE id = ?`,
    [
      first_name,
      last_name,
      email,
      job_title,
      department_id,
      salary,
      hourly_rate,
      hours_worked,
      phone,
      hire_date,
      status,
      id,
    ],
  );

  return getById(id);
}

// Delete an employee by id
async function remove(id) {
  await pool.query("DELETE FROM employees WHERE id = ?", [id]);
}

module.exports = { getAll, getById, create, update, remove };
