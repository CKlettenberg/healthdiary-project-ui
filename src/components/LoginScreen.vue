<template>
  <div>
    <h1 class="title">TERVISE PÄEVIK</h1>
    <h3 class="subtitle"> Tervise päevik aitab teil hoida silma peal enda ja kogu pere palavikul ja olulistel tervisenäitajatel. </h3>

    <!-- Initial Buttons -->
    <div v-if="!showLogin" class="button-container">
      <button class="green-button" @click="toggleLogin">Logi sisse</button>
      <button class="green-button" @click="goToRegister">Registreeri</button>
    </div>

    <!-- Login Form -->
    <form v-if="showLogin" @submit.prevent="handleLogin" class="form-container">
      <div class="input-group">
        <label for="username" class="label">Kasutaja:</label>
        <input v-model="username" id="username" class="input-field" required/>
        <label for="password" class="label">Parool:</label>
        <input v-model="password" type="password" id="password" class="input-field" required/>
      </div>
      <button type="submit" class="green-button">Logi sisse</button>
      <button class="secondary-button" @click="toggleLogin">Tagasi</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import {useAuthStore} from "@/stores/auth";

export default {
  data() {
    return {
      showLogin: false,
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
      this.$router.push("/register");
    },
    async handleLogin() {
      try {
        const response = await axios.post("http://localhost:8091/auth/login", {
          username: this.username,
          password: this.password,
        });

        const authStore = useAuthStore();
        authStore.login(response.data);

        this.$router.push("/menu");
      } catch (error) {
        this.errorMessage = "Invalid username or password. Please try again.";
      }
    },
  },
};
</script>

<style scoped>

.title {
  font-size: 5rem;
  color: #a1ff2e;
  text-shadow: 0 2px 4px rgba(0.4, 0.5, 0.7, 4);
  margin-bottom: 30px;
}
.subtitle {
  font-size: 2.5rem;
  color: #8df176;
  text-shadow: 0 2px 4px rgba(0.4, 0.5, 0.7, 4);
  margin-bottom: 30px;
  margin-inline: 30px;
  text-align: center;
  justify-content: center;
  display: flex;
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
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.green-button {
  width: 400px;
  background-color: #2ecc71;
  color: white;
  padding: 20px 25px;
  border: none;
  border-radius: 25px;
  font-size: 2.5rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.green-button:hover {
  background-color: #27ae60;
  transform: scale(1.05);
}

.error-message {
  color: red;
  font-size: 1rem;
  margin-top: 10px;
  text-align: center;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.7rem;
  }
  .subtitle {
    font-size: 1.8rem;
  }

  .input-field {
    font-size: 1.5rem;
  }

  .green-button,
  .secondary-button {
    font-size: 1.5rem;
  }
}
</style>
