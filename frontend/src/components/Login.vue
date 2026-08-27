<script>
import api from "../services/api.js";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    async handleLogin() {
      this.error = "";

      if (!this.email || !this.password) {
        this.error = "Please enter both email and password.";
        return;
      }

      try {
        const response = await api.post("/auth/login", {
          email: this.email,
          password: this.password,
        });

        // Save the token so our api.js interceptor can attach it to every future request automatically.
        localStorage.setItem("token", response.data.token);

        // let App.vue know login succeeded, passing up the token and user information
        this.$emit("login-success", response.data);
      } catch (err) {
        // The backend sends back a structured error message.
        // Fall back to a generic message if something unexpected happens
        this.error = err.response?.data?.error || "Invalid email or password.";
      }
    },
  },
};
</script>

<template>
  <div class="login-page">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>ModernTech HR System</h2>
      <p>Please log in to continue</p>

      <input v-model="email" type="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />

      <p v-if="error" class="error">{{ error }}</p>

      <button type="submit">Log In</button>
    </form>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f4f4;
}

.login-form {
  background: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 320px;
}

.login-form input {
  padding: 10px;
  font-size: 1rem;
}

.login-form button {
  padding: 10px;
  background-color: #212529;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error {
  color: #dc3545;
  margin: 0;
}
</style>
