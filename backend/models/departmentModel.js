const pool = require("../config/db.js");

// Get all departments, for populating dropdowns on the frontend
async function getAll() {
  const [rows] = await pool.query("SELECT * FROM departments");
  return rows;
}

module.exports = { getAll };
