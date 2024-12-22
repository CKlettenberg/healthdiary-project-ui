<template>
  <div @touchstart="startTouch" @touchmove="moveTouch">
    <div class="menu-content">
      <h1 class="title">Tervise päevik</h1>
      <div class="action-buttons">
        <button class="green-button" @click="navigateToAddPatient">Lisa patsient</button>
        <button class="green-button" @click="navigateToPatients">Kõik patsiendid</button>
      </div>
      <div class="swipe-hint">
        <p>Libistage vasakule, et vaadata kõige hiljutisemat patsienti.</p>
      </div>
      <div class="action-buttons">
        <button class="green-button" @click="navigateToChangePassword">Muuda parooli</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      patients: [],
      startX: 0,
    };
  },
  methods: {
    async fetchPatients() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated. Please log in.");
        this.$router.push("/");
        return;
      }
      const userId = localStorage.getItem("user");
      try {
        const response = await axios.get(`http://localhost:8091/api/patients/all-patients/by-user-id/${userId}`, {
          headers: {Authorization: `Bearer ${token}`},
        });
        this.patients = response.data.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
      } catch (error) {
        console.error("Error fetching patients:", error);
        alert("Failed to load patients. Please try again.");
      }
    },
    startTouch(event) {
      this.startX = event.touches[0].clientX; // Record the starting touch position
    },
    moveTouch(event) {
      const endX = event.touches[0].clientX; // Record the ending touch position
      const diffX = this.startX - endX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.navigateToLastModifiedPatient();
        }
        this.startX = 0;
      }
    },
    navigateToAddPatient() {
      this.$router.push("/add-patient");
    },
    navigateToPatients() {
      this.$router.push("/patients");
    },
    navigateToChangePassword() {
      this.$router.push("/change-password");
    },
    navigateToLastModifiedPatient() {
      if (this.patients.length > 0) {
        const lastModifiedPatient = this.patients[0]; // Get the most recently modified patient
        this.$router.push(`/patient/${lastModifiedPatient.id}`);
      } else {
        alert("No patients available.");
      }
    },
    openSettings() {
      alert("Settings page will be implemented soon!");
    },
  },
  mounted() {
    this.fetchPatients();
  },
};
</script>

<style scoped>
.menu-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}

.title {
  font-size: 2.5rem;
  color: #a1ff2e;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  margin-bottom: 30px;
}

.action-buttons {
  width: 170px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.green-button {
  width: 170px;
  background-color: #2ecc71;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.green-button:hover {
  background-color: #39ae27;
  transform: scale(1.05);
}

.swipe-hint {
  font-size: 1rem;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  margin-top: 20px;
  text-align: center;
}
</style>
