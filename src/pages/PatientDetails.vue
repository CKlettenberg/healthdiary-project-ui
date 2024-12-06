<template>
  <div class="patient-page">
    <!-- Top Buttons -->
    <div class="top-buttons">
      <button class="icon-button back" @click="goBack">
        <i class="fas fa-arrow-left"></i>
      </button>
      <button class="icon-button logout" @click="logout">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>

    <!-- Patient Details -->
    <div v-if="Object.keys(patient).length" class="patient-details">
      <h2 class="title">{{ patient.patientFullName }}</h2>
      <p><strong>Sünniaeg:</strong> {{ patient.dateOfBirth }}</p>
      <p><strong>Kaal:</strong> {{ patient.weight }} kg</p>
    </div>
    <div v-else class="loading">
      <p>Loading patient details...</p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

export default {
  name: "PatientDetails", // Ensure multi-word component naming
  data() {
    return {
      patient: {}, // Patient data object
    };
  },
  methods: {
    async fetchPatient() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated. Please log in.");
        this.$router.push("/");
        return;
      }

      const patientId = this.$route.params.patientId; // Fetch patient ID from route
      try {
        const response = await axios.get(`http://localhost:8091/api/patients/${patientId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.patient = response.data;
      } catch (error) {
        console.error("Error fetching patient details:", error);
        alert("Failed to load patient details. Please try again.");
      }
    },
    goBack() {
      this.$router.push("/patients");
    },
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push("/");
    },
  },
  mounted() {
    this.fetchPatient(); // Fetch patient details when component is mounted
  },
};
</script>

<style scoped>
/* Styling for Patient Details Page */
.patient-page {
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

.patient-details {
  text-align: center;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  margin-top: 50px;
}

.loading {
  text-align: center;
  color: #ffffff;
  font-size: 1.5rem;
  margin-top: 50px;
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
</style>
