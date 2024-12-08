<template>
  <div
      class="patient-page"
      @touchstart="startTouch"
      @touchmove="moveTouch"
      @keydown="handleKeyPress"
      tabindex="0"
  >

    <AddFeverData
        :patientId="currentPatient.id"
        v-model:isOpen="isModalOpen"
        @fetch-fever="fetchFeverRecords"
        ref="modal"
    />


    <!-- Patient Details -->
    <div class="patient-details">
      <h1 class="title">{{ currentPatient.patientFullName }}</h1>
      <p><strong>Sünniaeg:</strong> {{ currentPatient.dateOfBirth }}</p>
      <p><strong>Kaal:</strong> {{ currentPatient.weight }} kg</p>
    </div>

    <!-- Swipe Instructions -->
    <div class="swipe-instructions">
      <p>Libistage vasakule või paremale, või vajutage nooleklahve, et vaadata teisi patsiente.</p>
    </div>
    <!-- Fever Data -->
    <FeverData
        v-if="currentPatient.id"
        :patientId="currentPatient.id"
        :feverRecords="feverRecords"
        @fetch-fever="fetchFeverRecords"
    />
    <!-- Add New Fever Info Button -->
    <div class="add-info-container">
      <button class="green-button" @click="addFeverRecord">Lisa uus palaviku info</button>
    </div>
    <!-- Add New Health Info Button -->
    <div class="add-info-container">
      <button class="green-button" @click="addHealthInfo">Lisa uus tervise info</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import FeverData from "@/pages/FeverData.vue";
import AddFeverData from "@/pages/AddFeverForm.vue";

export default {
  name: "PatientDetails",
  components: {AddFeverData, FeverData},
  data() {
    return {
      isModalOpen: false,
      feverRecords: [],
      patients: [], // List of all patients
      currentPatientIndex: 0, // Index of the currently displayed patient
      startX: 0, // Start position for swipe
    };
  },
  computed: {
    currentPatient() {
      console.log(this.patients, 'patients')
      return this.patients[this.currentPatientIndex] || {};
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

      const userId = localStorage.getItem("user");
      try {
        const response = await axios.get(
            `http://localhost:8091/api/patients/all-patients/by-user-id/${userId}`,
            {
              headers: {Authorization: `Bearer ${token}`},
            }
        );

        // Sort patients by `lastModified` descending
        this.patients = response.data.sort(
            (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
        );

        // Set the current patient index to the patient ID passed in the route
        const initialPatientId = parseInt(this.$route.params.patientId, 10);
        this.currentPatientIndex = this.patients.findIndex(
            (patient) => patient.id === initialPatientId
        );
      } catch (error) {
        console.error("Error fetching patients:", error);
        alert("Failed to load patients. Please try again.");
      }
    },
    async fetchFeverRecords() {
      if (!this.currentPatient.id) return;

      try {
        const response = await axios.get(
            `http://localhost:8091/api/fever/patients/${this.currentPatient.id}/fever-records`
        );
        this.feverRecords = response.data;
      } catch (error) {
        console.error("Error loading fever records:", error);
        alert("Failed to load fever records.");
      }
    },
    addFeverRecord() {
      if (this.currentPatient && this.currentPatient.id) {
        this.isModalOpen = true; // Directly set the state to open the modal
      } else {
        alert("No valid patient selected.");
      }
    },
    addHealthInfo() {
      // Navigate to AddNewPatientData.vue with the current patient ID
      if (this.currentPatient && this.currentPatient.id) {
        this.$router.push(`/add-health-info/${this.currentPatient.id}`);
      } else {
        alert("No valid patient selected.");
      }
    },
  },

  async mounted() {
    await this.fetchPatients();
    await this.fetchFeverRecords();
  }
}
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
  outline: none; /* Prevent focus border on some browsers */
}


.patient-details {
  text-align: center;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  margin-top: 50px;
}

.swipe-instructions {
  font-size: 1rem;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  margin-top: 20px;
  text-align: center;
}

.add-info-container {
  margin-top: auto;
  margin-bottom: 20px;
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
