<template>
  <div>
    <h1 class="title">Tervise päevik - registreeri</h1>

    <form @submit.prevent="handleRegister" class="form-container">
      <div class="input-group">
        <label for="username" class="label">Kasutaja:</label>
        <input v-model="user.username" autocomplete="off" id="username" class="input-field" required/>

        <label for="password" class="label">Parool:</label>
        <input v-model="user.password" type="password" id="password" class="input-field" required/>

        <label for="confirm-password" class="label">Kinnita parool:</label>
        <input v-model="confirmPassword" type="password" id="confirm-password" class="input-field" required/>

        <label for="email" class="label">E-post (valikuline):</label>
        <input v-model="user.email" type="email" id="email" class="input-field"/>
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
.title {
  font-size: 3rem;
  color: #a1ff2e;
  text-shadow: 0 2px 4px rgba(0.4, 0.5, 0.7, 4);
  margin-bottom: 30px;
}

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.input-group {
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.label {
  font-size: 1.2rem;
  color: black;
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  padding: 12px;
  border-radius: 25px;
  font-size: 1.1rem;
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent input background */
  color: #333;
  border-style: double;
}

.input-field [placeholder="Username"] {
  font-family: monospace; /* Example styling */
}

.green-button {
  width: 135px;
  background-color: #2ecc71; /* Green button */
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
  width: 135px;
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
