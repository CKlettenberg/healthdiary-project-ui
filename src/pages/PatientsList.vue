<template>
  <div class="patients-page">
    <!-- Top Buttons -->
    <div class="top-buttons">
      <button class="icon-button settings" @click="openSettings">
        <i class="fas fa-cog"></i>
      </button>
      <button class="icon-button logout" @click="logout">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>

    <!-- Main Content -->
    <div class="menu-content">
      <h1 class="title">Tervise Päevik</h1>
      <div class="action-buttons">
        <button class="green-button" @click="navigateToAddPatient">Lisa Patsient</button>
      </div>
      <!-- Display message if no patients are available -->
      <div v-if="!patients.length" class="no-patients">
        <p>Patsiente pole leitud. Vajutage "Lisa Patsient", et luua uus.</p>
      </div>
      <!-- Display list of patients -->
      <div v-else>
        <h2 class="title">Kõik Patsientid</h2>
        <ul class="patients-list">
          <li v-for="patient in patients" :key="patient.id" @click="viewPatient(patient.id)">
            {{ patient.patientFullName }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

export default {
  data() {
    return {
      patients: [], // List of patients
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
      if (!userId) {
        console.error("User ID is missing.");
        alert("User not authenticated. Please log in.");
        this.$router.push("/");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8091/api/patients/all-patients/by-user-id/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.patients = response.data; // Populate patients list
      } catch (error) {
        console.error("Error fetching patients:", error);
        alert("Failed to load patients. Please try again.");
      }
    },
    navigateToAddPatient() {
      this.$router.push("/add-patient");
    },
    viewPatient(patientId) {
      this.$router.push(`/patient/${patientId}`); // Navigate to patient details
    },
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push("/");
    },
    openSettings() {
      alert("Settings page will be implemented soon!");
    },
  },
  mounted() {
    this.fetchPatients(); // Fetch patients on page load
  },
};
</script>

<style scoped>
/* Styles for Patients List Page */
.patients-page {
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

.patients-list {
  margin: 20px 0;
  list-style: none;
  padding: 0;
}

.patients-list li {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px 20px;
  border-radius: 25px;
  margin: 10px 0;
  cursor: pointer;
  text-align: center;
  font-size: 1.2rem;
}

.patients-list li:hover {
  background-color: #2ecc71;
  color: white;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.green-button {
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
  background-color: #27ae60;
  transform: scale(1.05);
}

.no-patients {
  margin-top: 20px;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  text-align: center;
}
</style>
