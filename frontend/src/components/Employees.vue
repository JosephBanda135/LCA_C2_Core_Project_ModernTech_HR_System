<script>
export default {
  props: {
    employees: {
      type: Array,
      default: () => [],
    },
    departments: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    errorMessage: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      // Field names now match the real employees table in MySQL,
      // not the old dummy-data shape.
      newEmployee: {
        first_name: "",
        last_name: "",
        email: "",
        job_title: "",
        department_id: "",
        salary: "",
        hourly_rate: "",
        hours_worked: 160,
        phone: "",
        hire_date: "",
      },
      // Stores the employee being edited
      editingEmployee: null,
      // Controls inline feedback message
      message: {
        text: "",
        type: "",
        visible: false,
      },
    };
  },

  watch: {
    // Whenever App.vue sets employeesError, show it
    // using the same inline alert we already use for validation messages.
    errorMessage(newValue) {
      if (newValue) {
        this.showMessage(newValue, "danger");
      }
    },
  },

  methods: {
    // Shows an inline alert
    showMessage(text, type) {
      this.message.text = text;
      this.message.type = type;
      this.message.visible = true;

      setTimeout(() => {
        this.message.visible = false;
      }, 3000);
    },

    addEmployee() {
      // Client-side validation - a first check before the request even goes out.
      // The server still validates everything again (and always must ).
      if (
        !this.newEmployee.first_name ||
        !this.newEmployee.last_name ||
        !this.newEmployee.email ||
        !this.newEmployee.department_id
      ) {
        this.showMessage("Please fill in all required fields.", "danger");
        return;
      }

      if (!this.newEmployee.salary || this.newEmployee.salary <= 0) {
        this.showMessage("Salary must be greater than 0.", "danger");
        return;
      }

      this.$emit("add-employee", {
        ...this.newEmployee,
        department_id: Number(this.newEmployee.department_id),
        salary: Number(this.newEmployee.salary),
        hourly_rate: Number(this.newEmployee.hourly_rate) || 0,
        hours_worked: Number(this.newEmployee.hours_worked) || 0,
      });

      this.showMessage("Employee added successfully!", "success");

      // Reset the form
      this.newEmployee = {
        first_name: "",
        last_name: "",
        email: "",
        job_title: "",
        department_id: "",
        salary: "",
        hourly_rate: "",
        hours_worked: 160,
        phone: "",
        hire_date: "",
      };
    },

    // Deletes Employee
    deleteEmployee(id) {
      this.$emit("delete-employee", id);
    },

    // Loads employee data into the edit form
    startEdit(employee) {
      this.editingEmployee = { ...employee };
    },

    // Saves the edited employee back to App.vue
    saveEdit() {
      this.$emit("update-employee", {
        ...this.editingEmployee,
        department_id: Number(this.editingEmployee.department_id),
        salary: Number(this.editingEmployee.salary),
        hourly_rate: Number(this.editingEmployee.hourly_rate) || 0,
        hours_worked: Number(this.editingEmployee.hours_worked) || 0,
      });
      this.editingEmployee = null;
    },

    // Cancels editing without saving
    cancelEdit() {
      this.editingEmployee = null;
    },
  },
};
</script>

<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Employee Management</h1>

    <!-- Inline feedback message -->
    <div
      v-if="message.visible"
      :class="`alert alert-${message.type} alert-dismissible`"
      role="alert"
    >
      {{ message.text }}
      <button
        type="button"
        class="btn-close"
        @click="message.visible = false"
      ></button>
    </div>

    <div class="card shadow p-4 mb-4">
      <h3 class="mb-3">Add Employee</h3>

      <div class="row g-3">
        <div class="col-md-2">
          <label class="form-label">First Name</label>
          <input
            type="text"
            class="form-control"
            placeholder="e.g. John"
            v-model="newEmployee.first_name"
          />
        </div>

        <div class="col-md-2">
          <label class="form-label">Last Name</label>
          <input
            type="text"
            class="form-control"
            placeholder="e.g. Smith"
            v-model="newEmployee.last_name"
          />
        </div>

        <div class="col-md-2">
          <label class="form-label">Department</label>
          <select class="form-select" v-model="newEmployee.department_id">
            <option value="" disabled>Select Department</option>
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>

        <div class="col-md-2">
          <label class="form-label">Job Title</label>
          <input
            type="text"
            class="form-control"
            placeholder="e.g. Developer"
            v-model="newEmployee.job_title"
          />
        </div>

        <div class="col-md-2">
          <label class="form-label">Salary (Monthly)</label>
          <input
            type="number"
            class="form-control"
            placeholder="e.g. 35000"
            v-model="newEmployee.salary"
          />
        </div>

        <div class="col-md-2">
          <label class="form-label">Hourly Rate</label>
          <input
            type="number"
            class="form-control"
            placeholder="e.g. 218.75"
            v-model="newEmployee.hourly_rate"
          />
        </div>

        <div class="col-md-2">
          <label class="form-label">Hours Worked</label>
          <input
            type="number"
            class="form-control"
            v-model="newEmployee.hours_worked"
          />
        </div>

        <div class="col-md-2">
          <label class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            placeholder="e.g. john@moderntech.com"
            v-model="newEmployee.email"
          />
        </div>

        <div class="col-md-2">
          <label class="form-label">Phone</label>
          <input
            type="text"
            class="form-control"
            placeholder="e.g. 0812345678"
            v-model="newEmployee.phone"
          />
        </div>

        <div class="col-md-3">
          <label class="form-label">Hire Date</label>
          <input
            type="date"
            class="form-control"
            v-model="newEmployee.hire_date"
          />
        </div>

        <div class="col-md-2 d-flex align-items-end">
          <button class="btn btn-primary w-100" @click="addEmployee">
            Add Employee
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Employee form - only shows when editing -->
    <div class="card shadow p-4 mb-4 border-warning" v-if="editingEmployee">
      <h3 class="mb-3">Edit Employee</h3>
      <div class="row g-3">
        <div class="col-md-2">
          <label class="form-label">First Name</label>
          <input
            type="text"
            class="form-control"
            placeholder="First Name"
            v-model="editingEmployee.first_name"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label">Last Name</label>
          <input
            type="text"
            class="form-control"
            placeholder="Last Name"
            v-model="editingEmployee.last_name"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label">Department</label>
          <select class="form-select" v-model="editingEmployee.department_id">
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <label class="form-label">Job Title</label>
          <input
            type="text"
            class="form-control"
            placeholder="Job Title"
            v-model="editingEmployee.job_title"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label">Salary (Monthly)</label>
          <input
            type="number"
            class="form-control"
            placeholder="Salary"
            v-model="editingEmployee.salary"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label">Hourly Rate</label>
          <input
            type="number"
            class="form-control"
            placeholder="Hourly Rate"
            v-model="editingEmployee.hourly_rate"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label">Hours Worked</label>
          <input
            type="number"
            class="form-control"
            placeholder="Hours Worked"
            v-model="editingEmployee.hours_worked"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label">Email</label>
          <input
            type="email"
            class="form-control"
            placeholder="Email"
            v-model="editingEmployee.email"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label">Phone</label>
          <input
            type="text"
            class="form-control"
            placeholder="Phone"
            v-model="editingEmployee.phone"
          />
        </div>
        <div class="col-md-2">
          <label class="form-label">Status</label>
          <select class="form-select" v-model="editingEmployee.status">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Hire Date</label>
          <input
            type="date"
            class="form-control"
            v-model="editingEmployee.hire_date"
          />
        </div>
        <div class="col-md-2">
          <button class="btn btn-success w-100" @click="saveEdit">Save</button>
        </div>
        <div class="col-md-2">
          <button class="btn btn-secondary w-100" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div class="card shadow p-3">
      <h3 class="mb-3">Employees</h3>

      <!-- Loading state - shown while the initial GET /employees request is in flight -->
      <div v-if="loading" class="text-center p-4">
        <p>Loading employees...</p>
      </div>

      <!-- Empty state - shown once loading is done  -->
      <div v-else-if="employees.length === 0" class="text-center p-4">
        <p>No employees found. Add your first employee above.</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-striped table-hover table-bordered">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Job Title</th>
              <th>Salary</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Hire Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="employee in employees" :key="employee.id">
              <td>{{ employee.id }}</td>
              <td>{{ employee.first_name }} {{ employee.last_name }}</td>
              <td>{{ employee.department_name }}</td>
              <td>{{ employee.job_title }}</td>
              <td>R{{ employee.salary }}</td>
              <td>{{ employee.email }}</td>
              <td>{{ employee.phone }}</td>
              <td>{{ employee.hire_date }}</td>
              <td>
                <span class="badge bg-success">
                  {{ employee.status }}
                </span>
              </td>
              <td>
                <button
                  class="btn btn-warning btn-sm me-2"
                  @click="startEdit(employee)"
                >
                  Edit
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteEmployee(employee.id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
