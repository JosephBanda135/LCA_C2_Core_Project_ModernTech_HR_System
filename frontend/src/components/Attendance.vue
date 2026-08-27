<script>
export default {
  props: ["attendanceRecords"],
  data() {
    return {
      // Controls inline feedback message
      message: {
        text: "",
        type: "",
        visible: false,
      },
    };
  },

  methods: {
    // Shows a Bootstrap inline alert then hides it after 3 seconds
    showMessage(text, type) {
      this.message.text = text;
      this.message.type = type;
      this.message.visible = true;

      setTimeout(() => {
        this.message.visible = false;
      }, 3000);
    },

    markPresent(record) {
      record.status = "Present";
      this.showMessage(record.employeeName + " marked Present.", "success");
    },

    markAbsent(record) {
      record.status = "Absent";
      this.showMessage(record.employeeName + " marked Absent.", "danger");
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
          <p>Present Today</p>
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
          <p>Absent Today</p>
        </div>
      </div>
    </div>

    <div class="card shadow p-4">
      <table class="table table-bordered table-striped">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Employee</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="record in attendanceRecords" :key="record.id">
            <td>{{ record.id }}</td>
            <td>{{ record.employeeName }}</td>
            <td>
              <span class="badge bg-success" v-if="record.status === 'Present'">
                Present
              </span>
              <span class="badge bg-danger" v-else>Absent</span>
            </td>
            <td>
              <button
                class="btn btn-success btn-sm me-2"
                @click="markPresent(record)"
                :disabled="record.status === 'Present'"
              >
                Present
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="markAbsent(record)"
                :disabled="record.status === 'Absent'"
              >
                Absent
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
