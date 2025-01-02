<template>
  <div>
    <div class="patient-details">
      <h2 class="title">Muuda patsienti</h2>
      <h2><strong>{{ patient.patientFullName }}</strong></h2>
      <p><strong>Sünniaeg:</strong> {{ patient.dateOfBirth }}</p>
      <p><strong>Kaal:</strong> {{ patient.weight }} kg</p>
    </div>

    <div class="content">
      <form @submit.prevent="submitUpdate">
        <div class="input-group">
          <label for="name" class="label">Nimi:</label>
          <input
              v-model="updatePatient.patientFullName"
              type="text"
              id="name"
              class="input-field"/>
        </div>
        <div class="input-group">
          <label for="dob" class="label">Sünniaeg:</label>
          <input
              v-model="updatePatient.dateOfBirth"
              type="date"
              id="dob"
              class="input-field"/>
        </div>
        <div class="input-group">
          <label for="weight" class="label">Kaal (kg):</label>
          <input
              v-model="updatePatient.weight"
              type="number"
              id="weight"
              class="input-field"/>
        </div>
        <button type="submit" class="green-button">Salvesta</button>
      </form>
      <button class="secondary-button" @click="navigateBack">Tagasi</button>
      <br>
      <button class="delete-button" @click="deletePatient">Kustuta patsient</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EditPatient",
  props: ["patientId"],
  data() {
    return {
      patient: {},
      updatePatient: {}// Holds patient details
    };
  },
  methods: {
    async fetchPatientDetails() {
      const patientId = this.$route.params.patientId;
      if (!patientId) {
        console.error("Patient ID is undefined.");
        this.$router.push("/patients"); // Redirect to patients list
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        alert("User not authenticated. Please log in.");
        this.$router.push("/login");
        return;
      }
      try {
        const response = await axios.get(
            `http://localhost:8091/api/patients/${this.patientId}`,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        this.patient = response.data;
        this.updatePatient = JSON.parse(JSON.stringify(this.patient));
      } catch (error) {
        console.error("Error fetching patient details:", error);
        alert("Failed to load patient details. Please try again.");
      }
    },
    async submitUpdate() {
      const token = localStorage.getItem("token");
      if (
          !this.updatePatient.patientFullName &&
          !this.updatePatient.dateOfBirth &&
          !this.updatePatient.weight
      ) {
        alert("Palun täida vähemalt üks väli.");
        return;
      }
      try {
        await axios.put(
            `http://localhost:8091/api/patients/${this.patientId}`,
            this.updatePatient,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        alert("Patsiendi andmed uuendatud!");
        this.$router.push(`/patient/${this.patientId}`);
      } catch (error) {
        console.error("Error updating patient:", error);
        alert("Failed to update patient. Please try again.");
      }
    },
    async deletePatient() {
      const token = localStorage.getItem("token");
      const confirmation = confirm("Olete kindel, et soovite patsiendi kustutada?");
      if (!confirmation) return;
      try {
        await axios.delete(
            `http://localhost:8091/api/patients/${this.patientId}`,
            {headers: {Authorization: `Bearer ${token}`}}
        );
        alert("Patsient edukalt kustutatud!");
        this.$router.push("/patients");
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Patsiendi kustutamine ebaõnnestus. Palun proovige uuesti.");
      }
    },
    navigateBack() {
      window.history.back();
    }
  },
  async mounted() {
    await this.fetchPatientDetails();
  },
};
</script>

<style scoped>

.patient-details {
  text-align: center;
  color: #000000;
  text-shadow: 0 2px 4px rgba(251, 250, 250, 0.7);
  margin-top: 1px;
}

.content {
  text-align: center;
  margin-top: 10px;
}


</style>
