<script>
import Login from "./components/Login.vue";
import Navbar from "./components/Navbar.vue";
import Dashboard from "./components/Dashboard.vue";
import Employees from "./components/Employees.vue";
import Payroll from "./components/Payroll.vue";
import LeaveRequests from "./components/LeaveRequests.vue";
import Attendance from "./components/Attendance.vue";
import api from "./services/api.js";

export default {
  components: {
    Login,
    Navbar,
    Dashboard,
    Employees,
    Payroll,
    LeaveRequests,
    Attendance,
  },
  // Main place where data shared across all components
  data() {
    return {
      currentPage: "login",
      token: null,
      user: null,
      // Employees are now loaded from the real API - see fetchEmployees()
      employees: [],
      employeesLoading: false,
      employeesError: "",
      // Departments are used to populate the department dropdown in the
      // Add/Edit Employee forms - loaded from GET /departments
      departments: [],
      // Leave/time-off requests now loaded from the real API - see fetchLeaveRequests()
      leaveRequests: [],
      leaveRequestsLoading: false,
      leaveRequestsError: "",
      // Attendance and payroll now loaded from the real API
      attendanceRecords: [],
      attendanceLoading: false,
      attendanceError: "",
      payrollRecords: [],
      payrollLoading: false,
      payrollError: "",
    };
  },
  methods: {
    // Fetches the real employee list from the database via the API.
    async fetchEmployees() {
      this.employeesLoading = true;
      this.employeesError = "";
      try {
        const response = await api.get("/employees");
        this.employees = response.data;
      } catch (err) {
        this.employeesError =
          err.response?.data?.error || "Failed to load employees.";
      } finally {
        this.employeesLoading = false;
      }
    },

    // Fetches departments, used to populate the dropdown in the employee forms.
    async fetchDepartments() {
      try {
        const response = await api.get("/departments");
        this.departments = response.data;
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    },

    // Adds Employee - sends the new employee to the database via the API.
    async addEmployee(emp) {
      this.employeesError = "";
      try {
        const response = await api.post("/employees", emp);
        // Push the record the SERVER returned (with its real database id),
        // not the one the form built - the database is the source of truth.
        this.employees.push(response.data);
      } catch (err) {
        this.employeesError =
          err.response?.data?.error || "Failed to add employee.";
      }
    },

    // Removes Employee - deletes it in the database, then removes it locally.
    async deleteEmployee(id) {
      this.employeesError = "";
      try {
        await api.delete(`/employees/${id}`);
        this.employees = this.employees.filter((e) => e.id !== id);
      } catch (err) {
        this.employeesError =
          err.response?.data?.error || "Failed to delete employee.";
      }
    },

    // Updates Employee - saves changes to the database, then updates locally.
    async updateEmployee(updated) {
      this.employeesError = "";
      try {
        const response = await api.put(`/employees/${updated.id}`, updated);
        const index = this.employees.findIndex((e) => e.id === updated.id);
        if (index !== -1) {
          this.employees[index] = response.data;
          this.employees = [...this.employees]; // triggers Vue reactivity
        }
      } catch (err) {
        this.employeesError =
          err.response?.data?.error || "Failed to update employee.";
      }
    },

    // Fetches real time-off requests from the database via the API.
    async fetchLeaveRequests() {
      this.leaveRequestsLoading = true;
      this.leaveRequestsError = "";
      try {
        const response = await api.get("/time-off");
        this.leaveRequests = response.data;
      } catch (err) {
        this.leaveRequestsError =
          err.response?.data?.error || "Failed to load leave requests.";
      } finally {
        this.leaveRequestsLoading = false;
      }
    },

    // Adds Leave request - sends it to the database via the API
    async addLeaveRequest(request) {
      this.leaveRequestsError = "";
      try {
        const response = await api.post("/time-off", request);
        this.leaveRequests.unshift(response.data);
      } catch (err) {
        this.leaveRequestsError =
          err.response?.data?.error || "Failed to submit leave request.";
      }
    },

    // Fetches real attendance records from the database
    async fetchAttendance() {
      this.attendanceLoading = true;
      this.attendanceError = "";
      try {
        const response = await api.get("/attendance");
        this.attendanceRecords = response.data;
      } catch (err) {
        this.attendanceError =
          err.response?.data?.error || "Failed to load attendance records.";
      } finally {
        this.attendanceLoading = false;
      }
    },

    // Records new attendance for an employee
    async addAttendance(record) {
      this.attendanceError = "";
      try {
        const response = await api.post("/attendance", record);
        this.attendanceRecords.unshift(response.data);
      } catch (err) {
        this.attendanceError =
          err.response?.data?.error || "Failed to record attendance.";
      }
    },

    // Fetches real payroll history from the database
    async fetchPayroll() {
      this.payrollLoading = true;
      this.payrollError = "";
      try {
        const response = await api.get("/payroll");
        this.payrollRecords = response.data;
      } catch (err) {
        this.payrollError =
          err.response?.data?.error || "Failed to load payroll records.";
      } finally {
        this.payrollLoading = false;
      }
    },

    // Generates (creates) a new payroll record
    async generatePayroll(record) {
      this.payrollError = "";
      try {
        const response = await api.post("/payroll", record);
        this.payrollRecords.unshift(response.data);
      } catch (err) {
        this.payrollError =
          err.response?.data?.error || "Failed to generate payroll.";
      }
    },

    // Called when Login.vue emits "login-success"
    handleLoginSuccess(data) {
      this.token = data.token;
      this.user = data.user;
      // Remember who's logged in so a page reload doesn't force a re-login
      // (the JWT itself is already saved to localStorage inside Login.vue)
      localStorage.setItem("user", JSON.stringify(data.user));
      this.currentPage = "dashboard";
      this.fetchEmployees();
      this.fetchDepartments();
      this.fetchLeaveRequests();
      this.fetchAttendance();
      this.fetchPayroll();
    },

    // Logs the user out and returns to the login screen
    logout() {
      this.token = null;
      this.user = null;
      this.employees = [];
      this.leaveRequests = [];
      this.attendanceRecords = [];
      this.payrollRecords = [];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.currentPage = "login";
    },
  },

  //Restores the logged-in session (if any), then loads real data from the API
  mounted() {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      this.token = savedToken;
      this.user = JSON.parse(savedUser);
      this.currentPage = "dashboard";
      this.fetchEmployees();
      this.fetchDepartments();
      this.fetchLeaveRequests();
      this.fetchAttendance();
      this.fetchPayroll();
    }
  },
};
</script>

<template>
  <!-- Show login screen if not authenticated yet -->
  <Login v-if="currentPage === 'login'" @login-success="handleLoginSuccess" />

  <!-- Everything below only shows once logged in -->
  <template v-else>
    <Navbar @change-page="currentPage = $event" @logout="logout" />
    <!--Dashboard component-->
    <Dashboard
      v-if="currentPage === 'dashboard'"
      :employees="employees"
      :leaveRequests="leaveRequests"
      :attendanceRecords="attendanceRecords"
    />
    <!--Employees component-->
    <Employees
      v-if="currentPage === 'employees'"
      :employees="employees"
      :departments="departments"
      :loading="employeesLoading"
      :error-message="employeesError"
      @add-employee="addEmployee"
      @delete-employee="deleteEmployee"
      @update-employee="updateEmployee"
    />

    <!--Payroll component-->
    <Payroll
      v-if="currentPage === 'payroll'"
      :employees="employees"
      :payrollRecords="payrollRecords"
      :loading="payrollLoading"
      :error-message="payrollError"
      @generate-payroll="generatePayroll"
    />

    <!--Leave Request component-->
    <LeaveRequests
      v-if="currentPage === 'leaveRequests'"
      :leaveRequests="leaveRequests"
      :employees="employees"
      :loading="leaveRequestsLoading"
      :error-message="leaveRequestsError"
      @add-leave-request="addLeaveRequest"
      @update-status="updateLeaveRequestStatus"
    />

    <!--Attendance component-->
    <Attendance
      v-if="currentPage === 'attendance'"
      :attendanceRecords="attendanceRecords"
      :employees="employees"
      :loading="attendanceLoading"
      :error-message="attendanceError"
      @add-attendance="addAttendance"
    />
  </template>
</template>
