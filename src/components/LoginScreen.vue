<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">Username:</label>
        <input v-model="username" type="text" id="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" style="color: red">{{ errorMessage }}</p>
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
        console.log(response.data); // Check if you get a successful response
        // Navigate to the Menu page
        this.$router.push("/menu");
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
