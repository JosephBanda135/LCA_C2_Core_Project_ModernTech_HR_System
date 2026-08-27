<script>
export default {
  props: {
    employees: {
      type: Array,
      default: () => [],
    },
    leaveRequests: {
      type: Array,
      default: () => [],
    },

    attendanceRecords: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<template>
  <!-- Dashboard summary cards -->
  <div class="container mt-4">
    <h1 class="mb-4">Dashboard</h1>

    <div class="row">
      <div class="col-md-3">
        <div class="card bg-primary text-white p-3">
          <h3>{{ employees.length }}</h3>
          <p>Total Employees</p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-success text-white p-3">
          <h3>
            {{ employees.filter((e) => e.status === "Active").length }}
          </h3>
          <p>Active Employees</p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-warning text-dark p-3">
          <h3>
            {{
              (leaveRequests || []).filter((r) => r.status === "Pending").length
            }}
          </h3>
          <p>Pending Leave Requests</p>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-info text-white p-3">
          <h3>
            R{{
              employees
                .reduce((total, e) => total + e.salary, 0)
                .toLocaleString()
            }}
          </h3>
          <p>Total Monthly Payroll</p>
        </div>
      </div>

      <div class="col-md-3 mt-3">
        <div class="card bg-secondary text-white p-3">
          <h3>
            {{
              attendanceRecords.filter((record) => record.status === "Present")
                .length
            }}
          </h3>
          <p>Present Today</p>
        </div>
      </div>
    </div>
  </div>
</template>
