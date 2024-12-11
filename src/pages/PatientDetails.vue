<template>
  <div
      @touchstart="startTouch"
      @touchmove="moveTouch"
      @keydown="handleKeyPress"
      tabindex="0"
  >
    <AddFeverData
        :patientId="currentPatient.id"
        v-model:isOpen="isFeverDataModalOpen"
        @fetch-fever="fetchFeverRecords"
        ref="modal"
    />
    <AddSymptoms
        :patientId="currentPatient.id"
        v-model:isOpen="isSymptomDataModalOpen"
        @fetch-symptoms="fetchSymptoms"
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
    <SymptomsData
        v-if="currentPatient.id"
        :patientId="currentPatient.id"
        :symptoms="symptomsData"
        @fetch-symptom="fetchSymptoms"
    />
    <!-- Add New Fever and Medication Info Button -->
    <div class="green-button-container">
      <button class="green-button" @click="addFeverRecord">Lisa palavik ja manustatud rohud</button>
    </div>
    <!-- Add New Symptoms Info Button -->
    <div class="green-button-container">
      <button class="green-button" @click="saveSymptoms">Lisa sümptomid</button>
    </div>
    <!-- Add New Health Info Button -->
    <div class="green-button-container">
      <button class="green-button" @click="addHealthInfo">Lisa uus tervise info</button>
    </div>
    <div class="green-button-container">
      <button class="green-button" @click="editPatient">Muuda patsiendi andmeid</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import FeverData from "@/pages/FeverData.vue";
import AddFeverData from "@/pages/AddFeverModal.vue";
import AddSymptoms from "@/pages/AddSymptomModal.vue";
import SymptomsData from "@/pages/SymptomsData.vue";


export default {
  name: "PatientDetails",
  components: {AddSymptoms, AddFeverData, FeverData, SymptomsData},  //Siit puudu
  data() {
    return {
      symptomsData: [],
      isFeverDataModalOpen: false,
      isSymptomDataModalOpen: false,
      feverRecords: [],
      patients: [], // List of all patients
      currentPatientIndex: 0, // Index of the currently displayed patient
      startX: 0, // Start position for swipe
    };
  },
  computed: {
    currentPatient() {
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
              headers: { Authorization: `Bearer ${token}` },
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
        this.isFeverDataModalOpen = true; // Directly set the state to open the modal
      } else {
        alert("No valid patient selected.");
      }
    },
    async fetchSymptoms() {
      if (!this.currentPatient.id) return;

      try {
        const response = await axios.get(
            `http://localhost:8091/api/symptoms/patients/${this.currentPatient.id}/symptom-records`
        );
        this.symptomsData = response.data;
      } catch (error) {
        console.error("Error loading symptoms records:", error);
        alert("Failed to load symptoms records.");
      }
    },
    saveSymptoms() {
      if (this.currentPatient && this.currentPatient.id) {
        this.isSymptomDataModalOpen = true; // Directly set the state to open the modal
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
    editPatient() {
      if (this.currentPatient && this.currentPatient.id) {
        this.$router.push({ name: "EditPatient", params: { patientId: this.currentPatient.id } });
      } else {
        alert("No valid patient selected.");
      }
    },
  },
  async mounted() {
    await this.fetchPatients();
    await this.fetchFeverRecords();
    await this.fetchSymptoms();
  },
};
</script>

<style scoped>
/* Styling for Patient Details Page */
.patient-details {
    font-size: 1rem;
    color: black;
    margin-bottom: 30px;
    text-align: center;
}

.swipe-instructions {
  font-size: 1rem;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  margin-top: 10px;
  text-align: center;
}

.green-button-container {
  display: flex;
  flex-direction: column; /* Stack buttons vertically */
  align-items: center; /* Align buttons horizontally in the center */
  gap: 20px;
  margin-top: 30px;/* Add spacing between buttons */
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
  width: 300px;

}

.green-button:hover {
  background-color: #27ae60; /* Darker green on hover */
  transform: scale(1.1); /* Slight zoom effect */
}
</style>
