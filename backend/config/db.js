const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // Without this, mysql2 returns DATE columns as JS Date objects,
  // JSON - shifting the date by a day and adding a bogus time component
  // (e.g. "2026-09-10" becomes "2026-09-09T22:00:00.)
  dateStrings: true,
});

module.exports = pool;
