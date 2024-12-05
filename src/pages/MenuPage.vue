<template>
  <div class="menu-page" @swipeleft="viewNextPatient" @swiperight="viewPreviousPatient">
    <div class="top-buttons">
      <button v-if="showPatientDetails" class="simple-btn left" @click="backToMenu">Back</button>
      <button class="simple-btn right" @click="logout">Logout</button>
    </div>

    <!-- Menu Page -->
    <div v-if="!showPatientDetails" class="menu-content">
      <h1>Tervise Päevik</h1>
      <div class="action-buttons">
        <button class="action-btn" @click="navigateToAddPatient">Add Patient</button>
        <button class="action-btn" @click="fetchPatients">View Patients</button>
      </div>
      <div v-if="!patients.length" class="no-patients">
        <p>No patients found. Click "Add Patient" to create one.</p>
      </div>
      <div class="swipe-hint" v-else>
        <p>Swipe left to view patient details</p>
      </div>
    </div>

    <!-- Patient Details -->
    <div v-if="showPatientDetails && currentPatient" class="patient-details">
      <h2>{{ currentPatient.patientFullName }}</h2>
      <p><strong>Date of Birth:</strong> {{ currentPatient.dateOfBirth }}</p>
      <p><strong>Weight:</strong> {{ currentPatient.weight }} kg</p>
      <div class="swipe-instructions">
        <p>Swipe left or right to view more patients</p>
      </div>
    </div>
    <div v-else-if="showPatientDetails && !currentPatient" class="patient-details">
      <p>No patients found.</p>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

export default {
  data() {
    return {
      showPatientDetails: false,
      currentPatientIndex: 0,
      patients: [], // Will hold patients fetched from the backend
    };
  },
  computed: {
    currentPatient() {
      return this.patients[this.currentPatientIndex] || null;
    },
  },
  methods: {
    async fetchPatients() {
        const token = localStorage.getItem('token');
        if (!token) {
          alert("User not authenticated. Please log in.");
          this.$router.push("/");
          return;
        }

        const api = axios.create({
          baseURL: 'http://localhost:8091/api',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userId = localStorage.getItem('user');
        if (!userId) {
          return;
        }
        api.get(`/patients/all-patients/by-user-id/${userId}`)
            .then((response) => {
              this.patients = response.data;
              if (this.patients.length > 0) {
                this.currentPatientIndex = 0;
                this.showPatientDetails = true;
              }
            })
            .catch((error) => {
              console.error("Error fetching patients:", error);
              alert("Failed to load patients. Please try again.");
            })
    },
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      alert("You have been logged out.");
      this.$router.push("/");
    },
    navigateToAddPatient() {
      this.$router.push("/add-patient");
    },
    backToMenu() {
      this.showPatientDetails = false;
    },
    viewNextPatient() {
      if (this.currentPatientIndex < this.patients.length - 1) {
        this.currentPatientIndex++;
      } else {
        alert("This is the last patient.");
      }
    },
    viewPreviousPatient() {
      if (this.currentPatientIndex > 0) {
        this.currentPatientIndex--;
      } else {
        alert("This is the first patient.");
      }
    },
  },
  mounted() {
    this.fetchPatients(); // Automatically load patients when MenuPage is mounted
  },
};
</script>

<style scoped>
/* Existing styles */
</style>
