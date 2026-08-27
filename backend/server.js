const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes.js");
const employeeRoutes = require("./routes/employeeRoutes.js");
const departmentRoutes = require("./routes/departmentRoutes.js");
const timeOffRoutes = require("./routes/timeOffRoutes.js");
const attendanceRoutes = require("./routes/attendanceRoutes.js");
const payrollRoutes = require("./routes/payrollRoutes.js");

dotenv.config(); // load .env variables

const app = express();

app.use(cors()); // allow requests from the Vue frontend
app.use(express.json()); // parse JSON request bodies

app.use("/auth", authRoutes); // handles /auth/register and /auth/login
app.use("/employees", employeeRoutes);
app.use("/departments", departmentRoutes);
app.use("/time-off", timeOffRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/payroll", payrollRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});