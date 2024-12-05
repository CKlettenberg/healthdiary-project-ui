<template>
  <div class="login-screen">
    <h1 class="title">Tervise Päevik</h1>

    <!-- Initial Buttons -->
    <div v-if="!showLogin" class="button-container">
      <button class="green-button" @click="toggleLogin">Logi Sisse</button>
      <button class="secondary-button" @click="goToRegister">Registreeri</button>
    </div>

    <!-- Login Form -->
    <form v-if="showLogin" @submit.prevent="handleLogin" class="form-container">
      <div class="input-group">
        <label for="username" class="label">Kasutaja:</label>
        <input v-model="username" type="text" id="username" class="input-field" required />
      </div>
      <div class="input-group">
        <label for="password" class="label">Parool:</label>
        <input v-model="password" type="password" id="password" class="input-field" required />
      </div>
      <button type="submit" class="green-button">Logi Sisse</button>
      <button type="button" class="secondary-button" @click="toggleLogin">Tagasi</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export default {
  data() {
    return {
      showLogin: false, // Toggle for showing login form
      username: "", // Changed back to username
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    toggleLogin() {
      this.showLogin = !this.showLogin;
    },
    goToRegister() {
      this.$router.push("/register"); // Navigate to the registration page
    },
    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:8091/auth/login", {
          username: this.username, // Send username instead of email
          password: this.password,
        });

        const authStore = useAuthStore();
        authStore.login(response.data);
        console.log(response)// Save user in authStore
        this.$router.push("/menu"); // Redirect to Menu Page
        console.log('here')
      } catch (error) {
        this.errorMessage = "Invalid username or password. Please try again.";
      }
    },
  },
};
</script>

<style scoped>
/* Existing styles */
</style>
