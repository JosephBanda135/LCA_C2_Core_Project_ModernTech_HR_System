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
      // Employees are now loaded from the real API
      employees: [],
      employeesLoading: false,
      employeesError: "",
      // Departments are used to populate the department dropdown in the
      // Add/Edit Employee forms - loaded from GET /departments
      departments: [],
      // Dummy Leave Request Data
      leaveRequests: [
        {
          id: 1,
          employeeName: "John Smith",
          leaveType: "Sick Leave",
          days: 2,
          status: "Pending",
        },

        {
          id: 2,
          employeeName: "Sarah Johnson",
          leaveType: "Annual Leave",
          days: 5,
          status: "Approved",
        },
      ],
      // Dummy Attendance Records
      attendanceRecords: [
        {
          id: 1,
          employeeName: "John Smith",
          status: "Present",
        },
        {
          id: 2,
          employeeName: "Sarah Johnson",
          status: "Absent",
        },
        {
          id: 3,
          employeeName: "Mike Brown",
          status: "Present",
        },
        {
          id: 4,
          employeeName: "David Wilson",
          status: "Present",
        },
        {
          id: 5,
          employeeName: "Emma Davis",
          status: "Absent",
        },
        {
          id: 6,
          employeeName: "James Miller",
          status: "Present",
        },
        {
          id: 7,
          employeeName: "Sophia Moore",
          status: "Present",
        },
        {
          id: 8,
          employeeName: "Daniel Taylor",
          status: "Absent",
        },
        {
          id: 9,
          employeeName: "Olivia Anderson",
          status: "Present",
        },
        {
          id: 10,
          employeeName: "William Thomas",
          status: "Present",
        },
        {
          id: 11,
          employeeName: "Ava White",
          status: "Present",
        },
        {
          id: 12,
          employeeName: "Benjamin Harris",
          status: "Absent",
        },
        {
          id: 13,
          employeeName: "Charlotte Martin",
          status: "Present",
        },
        {
          id: 14,
          employeeName: "Henry Thompson",
          status: "Present",
        },
        {
          id: 15,
          employeeName: "Grace Walker",
          status: "Present",
        },
      ],
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

    //Adds Leave request
    addLeaveRequest(request) {
      this.leaveRequests.push(request);
    },

    //Saves leave request data to LocalStorage (employees are now saved
    //in the real database, so they no longer need localStorage)
    saveData() {
      try {
        localStorage.setItem(
          "leaveRequests",
          JSON.stringify(this.leaveRequests),
        );
      } catch (error) {
        console.error("Error saving data:", error);
        alert("Could not save data. Try again.");
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
    },

    // Logs the user out and returns to the login screen
    logout() {
      this.token = null;
      this.user = null;
      this.employees = [];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.currentPage = "login";
    },
  },

  //Restores the logged-in session (if any) and loads saved leave request data
  mounted() {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      this.token = savedToken;
      this.user = JSON.parse(savedUser);
      this.currentPage = "dashboard";
      this.fetchEmployees();
      this.fetchDepartments();
    }

    const savedLeaves = localStorage.getItem("leaveRequests");
    if (savedLeaves) {
      this.leaveRequests = JSON.parse(savedLeaves);
    }
  },
  //Saves leave request data whenever it changes (employees now live in MySQL)
  watch: {
    leaveRequests: {
      deep: true,
      handler() {
        this.saveData();
      },
    },
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
    <Payroll v-if="currentPage === 'payroll'" :employees="employees" />

    <!--Leave Request component-->
    <LeaveRequests
      v-if="currentPage === 'leaveRequests'"
      :leaveRequests="leaveRequests"
      @add-leave-request="addLeaveRequest"
    />

    <!--Attendance component-->
    <Attendance
      v-if="currentPage === 'attendance'"
      :attendanceRecords="attendanceRecords"
    />
  </template>
</template>
