<template>
  <div class="login-screen">
    <h1 class="title">Welcome to Health Diary</h1>
    <form @submit.prevent="handleLogin" class="form-container">
      <div class="input-group">
        <label for="username" class="label">Username:</label>
        <input v-model="username" type="text" id="username" class="input-field" required />
      </div>
      <div class="input-group">
        <label for="password" class="label">Password:</label>
        <input v-model="password" type="password" id="password" class="input-field" required />
      </div>
      <button type="submit" class="green-button">Login</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:8091/auth/login", {
          username: this.username,
          password: this.password,
        });
        console.log(response.data); // Debugging
        this.$router.push("/menu"); // Navigate to Menu page
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.errorMessage = "Invalid username or password!";
        } else {
          this.errorMessage = "Something went wrong. Please try again.";
        }
      }
    },
  },
};
</script>

<style scoped>
.login-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f4f4f4;
}

.title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 20px;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.input-group {
  width: 100%;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.label {
  font-size: 1rem;
  margin-bottom: 5px;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
}

.green-button {
  background-color: #2ecc71;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.green-button:hover {
  background-color: #27ae60;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
