<script>
export default {
  props: {
    leaveRequests: {
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
      // Field names now match the real time_off_requests table
      newRequest: {
        employee_id: "",
        start_date: "",
        end_date: "",
        reason: "",
      },
      // Controls inline feedback message
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
    // Shows a Bootstrap inline alert then hides it after 3 seconds
    showMessage(text, type) {
      this.message.text = text;
      this.message.type = type;
      this.message.visible = true;

      setTimeout(() => {
        this.message.visible = false;
      }, 3000);
    },

    submitRequest() {
      if (
        !this.newRequest.employee_id ||
        !this.newRequest.start_date ||
        !this.newRequest.end_date
      ) {
        this.showMessage("Please select an employee and both dates.", "danger");
        return;
      }

      // The end date can't be before the start date - catch this before
      // it ever reaches the server.
      if (this.newRequest.end_date < this.newRequest.start_date) {
        this.showMessage("End date can't be before the start date.", "danger");
        return;
      }

      this.$emit("add-leave-request", {
        ...this.newRequest,
        employee_id: Number(this.newRequest.employee_id),
      });

      this.showMessage("Leave request submitted successfully!", "success");

      this.newRequest = {
        employee_id: "",
        start_date: "",
        end_date: "",
        reason: "",
      };
    },

    approveRequest(request) {
      this.$emit("update-status", { id: request.id, status: "Approved" });
    },

    rejectRequest(request) {
      this.$emit("update-status", { id: request.id, status: "Rejected" });
    },
  },
};
</script>

<template>
  <!--Leave Requests form-->
  <div class="container mt-4">
    <h1 class="mb-4">Leave Requests</h1>

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
      <h4>Submit Leave Request</h4>

      <div class="row g-3">
        <div class="col-md-3">
          <label class="form-label">Employee</label>
          <select class="form-select" v-model="newRequest.employee_id">
            <option value="" disabled>Select Employee</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">
              {{ emp.first_name }} {{ emp.last_name }}
            </option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Start Date</label>
          <input
            class="form-control"
            type="date"
            v-model="newRequest.start_date"
          />
        </div>

        <div class="col-md-3">
          <label class="form-label">End Date</label>
          <input
            class="form-control"
            type="date"
            v-model="newRequest.end_date"
          />
        </div>

        <div class="col-md-3">
          <label class="form-label">Reason</label>
          <input
            class="form-control"
            type="text"
            placeholder="e.g. Family event"
            v-model="newRequest.reason"
          />
        </div>
      </div>

      <button class="btn btn-primary mt-3" @click="submitRequest">
        Submit Request
      </button>
    </div>

    <div class="card shadow p-4">
      <h4 class="mb-3">Current Requests</h4>

      <!-- Loading state -->
      <div v-if="loading" class="text-center p-4">
        <p>Loading leave requests...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="leaveRequests.length === 0" class="text-center p-4">
        <p>No leave requests yet.</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="request in leaveRequests" :key="request.id">
              <td>{{ request.id }}</td>
              <td>{{ request.first_name }} {{ request.last_name }}</td>
              <td>{{ request.start_date }}</td>
              <td>{{ request.end_date }}</td>
              <td>{{ request.reason }}</td>
              <td>
                <span
                  class="badge bg-warning"
                  v-if="request.status === 'Pending'"
                >
                  Pending
                </span>

                <span
                  class="badge bg-success"
                  v-else-if="request.status === 'Approved'"
                >
                  Approved
                </span>

                <span class="badge bg-danger" v-else> Rejected </span>
              </td>
              <td>
                <button
                  class="btn btn-success btn-sm me-2"
                  @click="approveRequest(request)"
                  :disabled="request.status !== 'Pending'"
                >
                  Approve
                </button>

                <button
                  class="btn btn-danger btn-sm"
                  @click="rejectRequest(request)"
                  :disabled="request.status !== 'Pending'"
                >
                  Reject
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
