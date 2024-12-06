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
      username: "",
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
          username: this.username,
          password: this.password,
        });

        const authStore = useAuthStore();
        authStore.login(response.data);

        this.$router.push("/menu"); // Redirect to Menu Page
      } catch (error) {
        this.errorMessage = "Invalid username or password. Please try again.";
      }
    },
  },
};
</script>

<style scoped>
/* Updated styles */
.login-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url("@/assets/background.png"); /* Background image */
  background-size: cover; /* Make the image cover the entire screen */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevent tiling */
}

.title {
  font-size: 2.5rem;
  color: #ffffff; /* White text for title */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7); /* Shadow for contrast */
  margin-bottom: 30px;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
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
  font-size: 1.2rem;
  color: #ffffff; /* White label text */
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 1.1rem;
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent input background */
  color: #333;
}

.green-button {
  background-color: #2ecc71; /* Green button color */
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.green-button:hover {
  background-color: #27ae60; /* Darker green on hover */
  transform: scale(1.05); /* Slight zoom effect */
}

.secondary-button {
  background-color: transparent;
  color: #2ecc71;
  padding: 12px 25px;
  border: 2px solid #2ecc71;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, transform 0.2s;
}

.secondary-button:hover {
  background-color: #2ecc71; /* Green background on hover */
  color: white; /* White text on hover */
  transform: scale(1.05); /* Slight zoom effect */
}

.error-message {
  color: red;
  font-size: 1rem;
  margin-top: 10px;
  text-align: center;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .input-field {
    font-size: 1rem;
  }

  .green-button,
  .secondary-button {
    font-size: 1rem;
  }
}
</style>
