<template>
  <div class="menu-page" @swipeleft="viewNextPatient" @swiperight="viewPreviousPatient">
    <!-- Top Buttons -->
    <div class="top-buttons">
      <button class="icon-button settings" @click="openSettings">
        <i class="fas fa-cog"></i>
      </button>
      <button class="icon-button logout" @click="logout">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>

    <!-- Menu Page -->
    <div v-if="!showPatientDetails" class="menu-content">
      <h1 class="title">Tervise Päevik</h1>
      <div class="action-buttons">
        <button class="green-button" @click="navigateToAddPatient">Lisa Patsient</button>
        <button class="green-button" @click="fetchPatients">Vaata Patsiente</button>
      </div>
      <div v-if="!patients.length" class="no-patients">
        <p>Patsiente pole leitud. Vajutage "Lisa Patsient", et luua uus.</p>
      </div>
      <div class="swipe-hint" v-else>
        <p>Libistage vasakule, et vaadata patsiendi andmeid.</p>
      </div>
    </div>

    <!-- Patient Details -->
    <div v-if="showPatientDetails && currentPatient" class="patient-details">
      <h2 class="title">{{ currentPatient.patientFullName }}</h2>
      <p><strong>Sünniaeg:</strong> {{ currentPatient.dateOfBirth }}</p>
      <p><strong>Kaal:</strong> {{ currentPatient.weight }} kg</p>
      <div class="swipe-instructions">
        <p>Libistage vasakule või paremale, et vaadata rohkem patsiente.</p>
      </div>
      <button class="secondary-button back-button" @click="backToMenu">Tagasi</button>
    </div>
    <div v-else-if="showPatientDetails && !currentPatient" class="patient-details">
      <p>Patsiente pole leitud.</p>
      <button class="secondary-button back-button" @click="backToMenu">Tagasi</button>
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
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated. Please log in.");
        this.$router.push("/");
        return;
      }

      const api = axios.create({
        baseURL: "http://localhost:8091/api",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userId = localStorage.getItem("user");
      if (!userId) {
        return;
      }
      api
          .get(`/patients/all-patients/by-user-id/${userId}`)
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
          });
    },
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      alert("You have been logged out.");
      this.$router.push("/");
    },
    openSettings() {
      alert("Settings page will be implemented soon!"); // Replace with actual settings navigation logic
    },
    navigateToAddPatient() {
      this.$router.push("/add-patient");
    },
    backToMenu() {
      this.showPatientDetails = false; // Return to the main menu
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
/* Updated styles for top buttons, back button, and layout */
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

.settings {
  position: relative;
  left: 0;
}

.logout {
  position: relative;
  right: 0;
}

.title {
  font-size: 2.5rem;
  color: #ffffff; /* White text */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7); /* Shadow for contrast */
  margin-bottom: 30px;
  text-align: center;
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

.secondary-button {
  background-color: transparent;
  color: #2ecc71;
  padding: 12px 25px;
  border: 2px solid #2ecc71;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s, transform 0.2s;
}

.secondary-button:hover {
  background-color: #2ecc71; /* Green background on hover */
  color: white; /* White text on hover */
  transform: scale(1.05); /* Slight zoom effect */
}

.back-button {
  margin-top: 20px; /* Space above the back button */
}

.patient-details {
  text-align: center;
  margin-top: 20px;
  color: #ffffff; /* White text for details */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7); /* Shadow for readability */
}

.error-message {
  color: red;
  font-size: 1rem;
  margin-top: 10px;
  text-align: center;
}

.no-patients,
.swipe-hint {
  font-size: 1rem;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  text-align: center;
}
</style>
