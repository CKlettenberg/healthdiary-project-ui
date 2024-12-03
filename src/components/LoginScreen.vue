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
export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await fetch('http://localhost:8091/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username: this.username, password: this.password}),
        });

        if (!response.ok) {
          throw new Error('Invalid username or password');
        }

        const data = await response.json();
        console.log('Login successful:', data);

        // Emit a successful login event to the parent component
        this.$emit('login-success');

        // Optionally store the token in localStorage or sessionStorage
        localStorage.setItem('token', data.token);
      } catch (error) {
        this.errorMessage = error.message;
      }
    }
  }
};
</script>