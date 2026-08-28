<script>
export default {
  props: {
    attendanceRecords: {
      type: Array,
      default: () => [],
    },
    employees: {
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
      // Your backend only supports creating attendance records (no edit
      // endpoint), so this form logs a new record rather than toggling
      // an existing one.
      newRecord: {
        employee_id: "",
        date: "",
        status: "Present",
      },
      message: {
        text: "",
        type: "",
        visible: false,
      },
    };
  },

  watch: {
    errorMessage(newValue) {
      if (newValue) {
        this.showMessage(newValue, "danger");
      }
    },
  },

  methods: {
    showMessage(text, type) {
      this.message.text = text;
      this.message.type = type;
      this.message.visible = true;

      setTimeout(() => {
        this.message.visible = false;
      }, 3000);
    },

    submitRecord() {
      if (!this.newRecord.employee_id || !this.newRecord.date) {
        this.showMessage("Please select an employee and date.", "danger");
        return;
      }

      this.$emit("add-attendance", {
        ...this.newRecord,
        employee_id: Number(this.newRecord.employee_id),
      });

      this.showMessage("Attendance recorded.", "success");

      this.newRecord = {
        employee_id: "",
        date: "",
        status: "Present",
      };
    },
  },
};
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Attendance Tracking</h1>

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

    <div class="row mb-4">
      <div class="col-md-6">
        <div class="card bg-success text-white p-3">
          <h3>
            {{
              attendanceRecords.filter((record) => record.status === "Present")
                .length
            }}
          </h3>
          <p>Present Records</p>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card bg-danger text-white p-3">
          <h3>
            {{
              attendanceRecords.filter((record) => record.status === "Absent")
                .length
            }}
          </h3>
          <p>Absent Records</p>
        </div>
      </div>
    </div>

    <div class="card shadow p-4 mb-4">
      <h4 class="mb-3">Record Attendance</h4>
      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">Employee</label>
          <select class="form-select" v-model="newRecord.employee_id">
            <option value="" disabled>Select Employee</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.first_name }} {{ emp.last_name }}
            </option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Date</label>
          <input class="form-control" type="date" v-model="newRecord.date" />
        </div>

        <div class="col-md-3">
          <label class="form-label">Status</label>
          <select class="form-select" v-model="newRecord.status">
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        <div class="col-md-2 d-flex align-items-end">
          <button class="btn btn-primary w-100" @click="submitRecord">
            Record
          </button>
        </div>
      </div>
    </div>

    <div class="card shadow p-4">
      <!-- Loading state -->
      <div v-if="loading" class="text-center p-4">
        <p>Loading attendance records...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="attendanceRecords.length === 0" class="text-center p-4">
        <p>No attendance records yet.</p>
      </div>

      <table v-else class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="record in attendanceRecords" :key="record.id">
            <td>{{ record.id }}</td>
            <td>{{ record.first_name }} {{ record.last_name }}</td>
            <td>{{ record.date }}</td>
            <td>
              <span class="badge bg-success" v-if="record.status === 'Present'">
                Present
              </span>
              <span class="badge bg-danger" v-else>Absent</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
