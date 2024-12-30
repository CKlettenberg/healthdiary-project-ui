<template>
  <div>
    <h1 class="title">Tervise päevik - registreeri</h1>

    <form @submit.prevent="handleRegister" class="form-container">
      <div class="input-group">
        <label for="username" class="label">Kasutajanimi:</label>
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

.form-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.input-field [placeholder="Username"] {
  font-family: monospace; /* Example styling */
}

.error-message {
  color: red;
  font-size: 1rem;
  margin-top: 10px;
  text-align: center;
}
</style>
