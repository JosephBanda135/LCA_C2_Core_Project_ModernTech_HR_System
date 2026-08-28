<script>
export default {
  props: {
    employees: {
      type: Array,
      default: () => [],
    },
    payrollRecords: {
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
      // Applied to whichever employee's "Generate" button is clicked
      payPeriod: "",
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

    // Gross/tax/net are calculated here for display the  database
    // stores hourly_rate, hours_worked, and pay_period, and recalculates
    // gross/tax/net from those whenever it needs them
    grossPay(employee) {
      return (employee.hourly_rate || 0) * (employee.hours_worked || 0);
    },
    tax(employee) {
      return this.grossPay(employee) * 0.15;
    },
    netPay(employee) {
      return this.grossPay(employee) - this.tax(employee);
    },

    generatePayslip(employee) {
      if (!this.payPeriod) {
        this.showMessage(
          "Please enter a pay period (e.g. 'August 2026') before generating.",
          "danger",
        );
        return;
      }

      if (!employee.hourly_rate || !employee.hours_worked) {
        this.showMessage(
          `${employee.first_name} is missing an hourly rate or hours worked.`,
          "danger",
        );
        return;
      }

      this.$emit("generate-payroll", {
        employee_id: employee.id,
        hourly_rate: employee.hourly_rate,
        hours_worked: employee.hours_worked,
        pay_period: this.payPeriod,
      });

      this.showMessage(
        `Payslip generated for ${employee.first_name} ${employee.last_name}.`,
        "success",
      );
    },
  },
};
</script>

<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Payroll Management</h1>

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

    <div class="card shadow p-3 mb-4">
      <label class="form-label">Pay Period</label>
      <input
        class="form-control"
        style="max-width: 250px"
        type="text"
        placeholder="e.g. August 2026"
        v-model="payPeriod"
      />
    </div>

    <div class="card shadow p-3 mb-4">
      <h4 class="mb-3">Employees</h4>
      <div class="table-responsive">
        <table class="table table-striped table-hover table-bordered">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Hours Worked</th>
              <th>Hourly Rate</th>
              <th>Gross Pay</th>
              <th>Tax (15%)</th>
              <th>Net Pay</th>
              <th>Payslip</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="employee in employees" :key="employee.id">
              <td>{{ employee.id }}</td>
              <td>{{ employee.first_name }} {{ employee.last_name }}</td>
              <td>{{ employee.hours_worked }}</td>
              <td>R{{ employee.hourly_rate }}</td>
              <td>R{{ grossPay(employee).toFixed(2) }}</td>
              <td>R{{ tax(employee).toFixed(2) }}</td>
              <td>R{{ netPay(employee).toFixed(2) }}</td>
              <td>
                <button
                  class="btn btn-success btn-sm"
                  @click="generatePayslip(employee)"
                >
                  Generate
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card shadow p-3">
      <h4 class="mb-3">Payroll History</h4>

      <div v-if="loading" class="text-center p-4">
        <p>Loading payroll history...</p>
      </div>

      <div v-else-if="payrollRecords.length === 0" class="text-center p-4">
        <p>No payroll records generated yet.</p>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-bordered table-striped">
          <thead class="table-dark">
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Pay Period</th>
              <th>Hours Worked</th>
              <th>Hourly Rate</th>
              <th>Gross Pay</th>
              <th>Net Pay</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in payrollRecords" :key="record.id">
              <td>{{ record.id }}</td>
              <td>{{ record.first_name }} {{ record.last_name }}</td>
              <td>{{ record.pay_period }}</td>
              <td>{{ record.hours_worked }}</td>
              <td>R{{ record.hourly_rate }}</td>
              <td>
                R{{ (record.hourly_rate * record.hours_worked).toFixed(2) }}
              </td>
              <td>
                R{{
                  (record.hourly_rate * record.hours_worked * 0.85).toFixed(2)
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
