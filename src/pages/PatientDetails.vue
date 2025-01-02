<template>
  <div @touchstart="startTouch"
      @touchmove="moveTouch"
      @keydown="handleKeyPress"
      tabindex="0" >
    <AddFeverData
        :patientId="currentPatient.id"
        :updateFeverRecord="updateFeverRecord"
        v-model:isOpen="isFeverDataModalOpen"
        @update:isOpen="isModalOpen = $event"
        @fetch-fever="fetchFeverRecords"
        ref="modal" />
    <AddSymptoms
        :patientId="currentPatient.id"
        v-model:isOpen="isSymptomDataModalOpen"
        @fetch-symptoms="fetchSymptoms"
        ref="modal" />

    <div class="patient-details">
      <h1 class="title">{{ currentPatient.patientFullName }}</h1>
      <button class="secondary-button" @click="editPatient">Muuda patsiendi andmeid</button>

      <p><strong>Sünniaeg:</strong> {{ currentPatient.dateOfBirth }}</p>
        <p><strong>Kaal:</strong> {{ currentPatient.weight }} kg</p>
    </div>
    <div class="top-buttons">
      <button class="green-button" @click="addFeverRecord">Lisa palavik ja ravimid</button>
      <button class="green-button" @click="saveSymptoms">Lisa sümptomid</button>
    </div>

    <FeverData
        v-if="currentPatient.id"
        :patient="currentPatient"
        :feverRecords="feverRecords"
        @fetch-fever="fetchFeverRecords"
        @update-fever="updateFeverRecords"/>
    <SymptomsData
        v-if="currentPatient.id"
        :patientId="currentPatient.id"
        :symptoms="symptomsData"
        @fetch-symptom="fetchSymptoms" />
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
      patients: [],
      currentPatientIndex: 0,
      startX: 0,
      updateFeverRecord: null
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
            { headers: {Authorization: `Bearer ${token}`},
            }
        );
        this.patients = response.data.sort(
            (a, b) => new Date(b.lastModified) - new Date(a.lastModified)
        );
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
        this.isSymptomDataModalOpen = true;
      } else {
        alert("No valid patient selected.");
      }
    },
    editPatient() {
      if (this.currentPatient && this.currentPatient.id) {
        this.$router.push({name: "EditPatient", params: {patientId: this.currentPatient.id}});
      } else {
        alert("No valid patient selected.");
      }
    },
    updateFeverRecords(entry) {
      this.updateFeverRecord = entry[0];
      console.log(this.updateFeverRecord, 'kjhuygt')
      this.isFeverDataModalOpen = true;
    }
  },
  async mounted() {
    await this.fetchPatients();
    await this.fetchFeverRecords();
    await this.fetchSymptoms();
  },
};
</script>

<style scoped>
.patient-details {
  font-size: 1.3rem;
  color: black;
  margin-bottom: 10px;
  text-align: center;

}

.green-button {
  padding: 20px 50px;
  font-size: 1.7rem;
}

@media (max-width: 767px) {
  .green-button {
    font-size: 1.5rem;
    justify-content: space-around;
    padding: 10px 15px;
}
  .top-buttons {
    width: 90%;
  }
}
</style>
