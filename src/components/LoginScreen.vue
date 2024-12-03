<template>
  <div class="login-screen">
    <h1>Welcome</h1>
    <div class="content-container">
      <div v-if="showLoginFields" class="form-container">
        <input
            type="text"
            v-model="username"
            placeholder="Enter Username"
            class="input-field"
        />
        <input
            type="password"
            v-model="password"
            placeholder="Enter Password"
            class="input-field"
        />
        <button class="submit-btn" @click="login">Submit</button>
        <p v-if="error" class="error">{{ error }}</p>
      </div>
      <div v-else class="button-container">
        <button class="login-btn" @click="showLogin">Login</button>
        <button class="register-btn">Registreeri</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      showLoginFields: false,
      username: "",
      password: "",
      error: null,
    };
  },
  methods: {
    showLogin() {
      this.showLoginFields = true;
    },
    async login() {
      try {
        await axios.post("http://localhost:8080/login", {
          username: this.username,
          password: this.password,
        });

// Use the response (e.g., log the data)

        // On success, redirect to the menu page
        alert("Login successful!");
        this.$router.push("/menu");
      } catch (error) {
  if (error.response && error.response.status === 401) {
  this.error = "Invalid username or password!";
} else {
  this.error = "Something went wrong. Please try again.";
}
}
},
},
};
</script>
