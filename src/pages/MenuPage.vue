<template>
  <div class="menu-page" @touchstart="startTouch" @touchmove="moveTouch">
    <!-- Main Menu Content -->
    <div class="menu-content">
      <h1 class="title">Tervise Päevik</h1>
      <div class="action-buttons">
        <button class="green-button" @click="navigateToAddPatient">Lisa patsient</button>
        <button class="green-button" @click="navigateToPatients">Vaata patsiente</button>
      </div>
      <div class="swipe-hint">
        <p>Libistage vasakule, et vaadata kõige hiljutisemat patsienti.</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      patients: [], // Holds all patients fetched from the backend
      startX: 0, // Initial touch position for swipe
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
          headers: { Authorization: `Bearer ${token}` },
        });

        // Sort patients by `lastModified` descending
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
          // Swipe left
          this.navigateToLastModifiedPatient();
        }
        this.startX = 0; // Reset swipe detection
      }
    },
    navigateToAddPatient() {
      this.$router.push("/add-patient");
    },
    navigateToPatients() {
      this.$router.push("/patients");
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
    this.fetchPatients(); // Fetch patients on mount
  },
};
</script>

<style scoped>
/* Styling for Menu Page */
.menu-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url("@/assets/background.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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

.swipe-hint {
  font-size: 1rem;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  margin-top: 20px;
  text-align: center;
}
</style>
