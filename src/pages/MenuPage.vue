<template>
  <div class="menu-page">
    <!-- Header -->
    <div class="header">
      <button class="settings-btn">⚙ Settings</button>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>

    <!-- Menu Buttons -->
    <div class="menu-buttons">
      <button class="menu-btn" @click="addNewData">Add New Data for Patient</button>
      <button class="menu-btn" @click="addPatient">Add Patient</button>
      <button class="menu-btn" @click="showPatients">Show All Patients</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MenuPage",
  methods: {
    logout() {
      // Redirect back to login page
      this.$router.push("/");
    },
    addNewData() {
      alert("Navigate to Add New Data Page (functionality pending)");
    },
    addPatient() {
      alert("Navigate to Add Patient Page (functionality pending)");
    },
    showPatients() {
      alert("Navigate to Show All Patients Page (functionality pending)");
    },
  },
};
</script>

<style scoped>
.menu-page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
  font-family: Arial, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
  box-sizing: border-box;
}

.settings-btn,
.logout-btn {
  background-color: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #333;
  font-weight: bold;
}

.menu-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  width: 100%;
  max-width: 300px; /* Centered and narrow */
  margin-top: auto; /* Push buttons downward for balance */
  margin-bottom: auto;
}

.menu-btn {
  width: 100%;
  height: 50px;
  background-color: #90ee90; /* Light green */
  border: none;
  border-radius: 25px; /* Oval shape */
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.menu-btn:hover {
  background-color: #76c776; /* Slightly darker green */
}
</style>
