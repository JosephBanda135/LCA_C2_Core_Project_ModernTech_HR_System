<script>
export default {
  props: {
    leaveRequests: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      //Stores detailes entered into the Leave request form
      newRequest: {
        employeeName: "",
        leaveType: "",
        days: "",
      },
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

    submitRequest() {
      if (
        !this.newRequest.employeeName ||
        !this.newRequest.leaveType ||
        !this.newRequest.days
      ) {
        this.showMessage("Please fill in all fields.", "danger");
        return;
      }

      this.$emit("add-leave-request", {
        id: this.leaveRequests.length + 1,
        employeeName: this.newRequest.employeeName,
        leaveType: this.newRequest.leaveType,
        days: this.newRequest.days,
        status: "Pending",
      });

      this.showMessage("Leave request submitted successfully!", "success");

      this.newRequest = {
        employeeName: "",
        leaveType: "",
        days: "",
      };
    },

    approveRequest(request) {
      request.status = "Approved";
      this.showMessage(
        `${request.employeeName}'s request has been approved.`,
        "success",
      );
    },

    denyRequest(request) {
      request.status = "Denied";
      this.showMessage(
        `${request.employeeName}'s request has been denied.`,
        "danger",
      );
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

      <input
        class="form-control mb-3"
        type="text"
        placeholder="Employee Name"
        v-model="newRequest.employeeName"
      />

      <input
        class="form-control mb-3"
        type="text"
        placeholder="Leave Type"
        v-model="newRequest.leaveType"
      />

      <input
        class="form-control mb-3"
        type="number"
        placeholder="Days Requested"
        v-model="newRequest.days"
      />

      <button class="btn btn-primary" @click="submitRequest">
        Submit Request
      </button>
    </div>

    <div class="card shadow p-4">
      <h4 class="mb-3">Current Requests</h4>

      <div class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Days</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="request in leaveRequests" :key="request.id">
              <td>{{ request.id }}</td>
              <td>{{ request.employeeName }}</td>
              <td>{{ request.leaveType }}</td>
              <td>{{ request.days }}</td>
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

                <span class="badge bg-danger" v-else> Denied </span>
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
                  @click="denyRequest(request)"
                  :disabled="request.status !== 'Pending'"
                >
                  Deny
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
