<template>
  <div class="menu-page">
    <!-- Top Buttons -->
    <div class="top-buttons">
      <button class="icon-button settings" @click="openSettings">
        <i class="fas fa-cog"></i>
      </button>
      <button class="icon-button logout" @click="logout">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>

    <!-- Main Menu Content -->
    <div class="menu-content">
      <h1 class="title">Tervise Päevik</h1>
      <div class="action-buttons">
        <button class="green-button" @click="navigateToAddPatient">Lisa Patsient</button>
        <button class="green-button" @click="navigateToPatients">Vaata Patsiente</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";

export default {
  methods: {
    navigateToAddPatient() {
      this.$router.push("/add-patient");
    },
    navigateToPatients() {
      this.$router.push("/patients");
    },
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      alert("You have been logged out.");
      this.$router.push("/");
    },
    openSettings() {
      alert("Settings page will be implemented soon!");
    },
  },
};
</script>

<style scoped>
/* Updated styles for visual consistency */
.menu-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url("@/assets/background.png"); /* Background image */
  background-size: cover; /* Cover the screen */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevent tiling */
}

.top-buttons {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 10px;
  width: 95%;
}

.icon-button {
  background-color: transparent;
  border: none;
  color: #ffffff; /* White color for icons */
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s, color 0.3s;
}

.icon-button:hover {
  transform: scale(1.2); /* Slight zoom effect */
  color: #2ecc71; /* Green on hover */
}

.menu-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}

.title {
  font-size: 2.5rem;
  color: #ffffff; /* White text */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7); /* Shadow for contrast */
  margin-bottom: 30px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.green-button {
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
</style>
