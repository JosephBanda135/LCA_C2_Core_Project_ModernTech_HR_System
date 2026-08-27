<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <a class="navbar-brand" href="#">ModernTech HR System</a>

      <!-- Hamburger Button -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Collapsible Menu -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="navbar-nav ms-auto">
          <button
            class="btn btn-outline-light me-2 mb-2"
            @click="$emit('change-page', 'dashboard')"
          >
            Dashboard
          </button>

          <button
            class="btn btn-outline-light me-2 mb-2"
            @click="$emit('change-page', 'employees')"
          >
            Employees
          </button>

          <button
            class="btn btn-outline-light me-2 mb-2"
            @click="$emit('change-page', 'payroll')"
          >
            Payroll
          </button>

          <button
            class="btn btn-outline-light me-2 mb-2"
            @click="$emit('change-page', 'leaveRequests')"
          >
            Leave Requests
          </button>

          <button
            class="btn btn-outline-light mb-2"
            @click="$emit('change-page', 'attendance')"
          >
            Attendance
          </button>

          <button class="btn btn-outline-danger mb-2" @click="$emit('logout')">
            Log Out
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>
