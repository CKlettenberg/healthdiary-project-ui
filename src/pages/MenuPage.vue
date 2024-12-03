<template>
  <div class="menu-page">
    <div class="top-buttons">
      <button class="simple-btn left" @click="goToSettings">Settings</button>
      <button class="simple-btn right" @click="logout">Logout</button>
    </div>
    <h1>Welcome to the Menu Page</h1>
    <div class="action-buttons">
      <button class="action-btn">Add Patient</button>
      <button class="action-btn">Remove Patient</button>
      <button class="action-btn">Modify Patient</button>
      <button class="action-btn">View Patient</button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";

export default {
  methods: {
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.menu-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.top-buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.simple-btn {
  background: none;
  border: none;
  color: #007bff;
  font-size: 16px;
  cursor: pointer;
}

.simple-btn:hover {
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  width: 200px;
  text-align: center;
}

.action-btn:hover {
  background-color: #45a049;
}
</style>
