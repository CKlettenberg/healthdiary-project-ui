<template>
  <div class="register-screen">
    <h1 class="title">Tervise Päevik - Registreeri</h1>

    <form @submit.prevent="handleRegister" class="form-container">
      <div class="input-group">
        <label for="username" class="label">Kasutaja:</label>
        <input v-model="user.username" type="text" id="username" class="input-field" required />
      </div>
      <div class="input-group">
        <label for="password" class="label">Parool:</label>
        <input v-model="user.password" type="password" id="password" class="input-field" required />
      </div>
      <div class="input-group">
        <label for="confirm-password" class="label">Kinnita Parool:</label>
        <input v-model="confirmPassword" type="password" id="confirm-password" class="input-field" required />
      </div>
      <div class="input-group">
        <label for="email" class="label">E-post (Valikuline):</label>
        <input v-model="user.email" type="email" id="email" class="input-field" />
      </div>
      <button type="submit" class="green-button">Registreeri</button>
      <button type="button" class="secondary-button" @click="goBack">Tagasi</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
        email: "",
      },
      confirmPassword: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleRegister() {
      if (this.user.password !== this.confirmPassword) {
        this.errorMessage = "Paroolid ei klapi!";
        return;
      }
      try {
        await axios.post("http://localhost:8091/api/users/register", this.user);
        alert("Registreerimine õnnestus! Nüüd saate sisse logida.");
        this.$router.push("/"); // Navigate back to login screen
      } catch (error) {
        this.errorMessage =
            error.response && error.response.status === 409
                ? "Kasutajanimi on juba võetud!"
                : "Midagi läks valesti. Palun proovi uuesti.";
      }
    },
    goBack() {
      this.$router.push("/"); // Navigate back to the login screen
    },
  },
};
</script>

<style scoped>
/* Styles remain the same as the LoginScreen */
.register-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url("@/assets/background.png"); /* Background image path */
  background-size: auto; /* Make the image cover the entire screen */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevent tiling */
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

.secondary-button {
  background-color: transparent;
  color: #2ecc71;
  padding: 10px 20px;
  border: 1px solid #2ecc71;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.secondary-button:hover {
  background-color: #2ecc71;
  color: white;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>
