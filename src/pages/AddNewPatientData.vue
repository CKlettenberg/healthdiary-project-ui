<template>
  <div class="add-data-page">
    <!-- Top Buttons -->
    <div class="top-buttons">
      <button class="icon-button back" @click="goBack">
        <i class="fas fa-arrow-left"></i>
      </button>
      <button class="icon-button logout" @click="logout">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>

    <!-- Patient Name and Input Box -->
    <div class="content">
      <h1 class="title">{{ patient.patientFullName }}</h1>
      <div class="input-group">
        <label for="healthInfo" class="label">Lisa Uus Tervise Info:</label>
        <textarea
            id="healthInfo"
            v-model="healthInfo"
            class="input-box"
            placeholder="Sisesta tervise info siia..."
        ></textarea>
      </div>
      <button class="green-button" @click="submitHealthInfo">Salvesta</button>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

export default {
  name: "AddNewPatientData",
  data() {
    return {
      patient: {}, // Holds patient details
      healthInfo: "", // Text input for new health info
    };
  },
  methods: {
    async fetchPatientDetails() {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated. Please log in.");
        this.$router.push("/");
        return;
      }

      const patientId = this.$route.params.patientId; // Get patient ID from route
      try {
        const response = await axios.get(
            `http://localhost:8091/api/patients/${patientId}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        this.patient = response.data; // Load patient details
      } catch (error) {
        console.error("Error fetching patient details:", error);
        alert("Failed to load patient details. Please try again.");
      }
    },
    async submitHealthInfo() {
      if (!this.healthInfo.trim()) {
        alert("Palun sisesta tervise info.");
        return;
      }

      const token = localStorage.getItem("token");
      const patientId = this.$route.params.patientId;
      try {
        await axios.post(
            `http://localhost:8091/api/patients/${patientId}/add-health-info`,
            { info: this.healthInfo },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Tervise info salvestatud!");
        this.$router.push(`/patient/${patientId}`); // Redirect back to patient details
      } catch (error) {
        console.error("Error submitting health info:", error);
        alert("Failed to save health info. Please try again.");
      }
    },
    goBack() {
      this.$router.push(`/patient/${this.$route.params.patientId}`); // Return to PatientDetails page
    },
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push("/");
    },
    checkAuthentication() {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        alert("User not authenticated. Redirecting to login.");
        this.$router.push("/");
      }
    },
  },
  mounted() {
    this.checkAuthentication(); // Check if the user is authenticated
    this.fetchPatientDetails(); // Fetch patient details if authenticated
  },
};
</script>

<style scoped>
/* Styling for Add New Patient Data Page */
.add-data-page {
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
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s, color 0.3s;
}

.icon-button:hover {
  transform: scale(1.2);
  color: #2ecc71;
}

.content {
  text-align: center;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
}

.title {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.input-group {
  margin-top: 20px;
  width: 100%;
  max-width: 400px;
  text-align: left;
}

.label {
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.input-box {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  resize: none;
  height: 150px;
}

.green-button {
  background-color: #2ecc71;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s, transform 0.2s;
}

.green-button:hover {
  background-color: #27ae60;
  transform: scale(1.05);
}
</style>
