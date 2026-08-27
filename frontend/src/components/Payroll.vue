<script>
export default {
  props: ["employees"],

  methods: {
    generatePayslip(employee) {
      const gross = employee.hoursWorked * employee.hourlyRate;
      const tax = gross * 0.15;
      const net = gross - tax;

      alert(
        `PAYSLIP

Name: ${employee.name}

Hours Worked: ${employee.hoursWorked}
Hourly Rate: R${employee.hourlyRate}

Gross Pay: R${gross}
Tax (15%): R${tax}
Net Pay: R${net}`,
      );
    },
  },
};
</script>

<template>
  <div class="container mt-4">
    <h1 class="text-center mb-4">Payroll Management</h1>

    <div class="card shadow p-3">
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
              <td>{{ employee.name }}</td>

              <td>{{ employee.hoursWorked }}</td>
              <td>R{{ employee.hourlyRate }}</td>

              <td>R{{ employee.hoursWorked * employee.hourlyRate }}</td>
              <td>R{{ employee.hoursWorked * employee.hourlyRate * 0.15 }}</td>
              <td>
                R{{
                  employee.hoursWorked * employee.hourlyRate -
                  employee.hoursWorked * employee.hourlyRate * 0.15
                }}
              </td>

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
  </div>
</template>
