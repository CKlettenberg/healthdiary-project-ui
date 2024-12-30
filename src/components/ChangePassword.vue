<template>
  <div class="change-password">
    <h2 class="title">Muuda parool</h2>
    <form @submit.prevent="changePassword">
      <div class="input-group">
        <label for="current-password" class="label">Praegune parool:</label>
        <input
            id="current-password"
            type="password"
            v-model="currentPassword"
            class="input-field"
            required
        />
      </div>
      <div>
        <label for="new-password" class="label">Uus parool:</label>
        <input
            id="new-password"
            type="password"
            v-model="newPassword"
            class="input-field"
            required
        />
      </div>
      <div>
        <label for="confirm-password" class="label">Kinnitage uus parool:</label>
        <input
            id="confirm-password"
            type="password"
            v-model="confirmPassword"
            class="input-field"
            required
        />
      </div>
      <button class="green-button" type="submit">Parooli muutmine</button>
    </form>
    <br>
    <button class="secondary-button" @click="navigateBack">Tagasi</button>
    <br>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userId: null,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      errorMessage: '',
      successMessage: '',
    };
  },

    methods: {
      async changePassword() {
        if (this.newPassword !== this.confirmPassword) {
          this.errorMessage = 'New password and confirmation do not match.';
          this.successMessage = '';
          return;
        }

        try {
          const userId = localStorage.getItem("user");
          await axios.put(`http://192.168.1.40:8091/api/users/change-password/${userId}`, {
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
            confirmPassword: this.confirmPassword,
          });

          this.successMessage = 'Password successfully changed!';
          this.errorMessage = '';
          // Clear inputs after successful password change
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'Password change failed.';
          this.successMessage = '';
        }
      },
      navigateBack() {
        window.history.back();
      }
    }

    }

</script>

<style scoped>
.error {
  color: red;
}

.success {
  color: green;
}

form {
  max-width: 300px;
  margin: auto;
}

div {
  margin-bottom: 10px;
}
</style>