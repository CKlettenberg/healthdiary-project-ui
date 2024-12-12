<template>
  <div>
    <!-- Patient Details -->
    <div class="patient-details">
      <h1 class="title">Muuda Patsienti</h1>
      <h1 class="title">{{ patient.patientFullName }}</h1>
      <p><strong>Sünniaeg:</strong> {{ patient.dateOfBirth }}</p>
      <p><strong>Kaal:</strong> {{ patient.weight }} kg</p>
    </div>

    <!-- Edit Form -->
    <div class="content">
      <form @submit.prevent="submitUpdate">
        <div class="input-group">
          <label for="name" class="label">Nimi:</label>
          <input
              v-model="updatePatient.patientFullName"
              type="text"
              id="name"
              class="input-field"

          />
        </div>
        <div class="input-group">
          <label for="dob" class="label">Sünniaeg:</label>
          <input
              v-model="updatePatient.dateOfBirth"
              type="date"
              id="dob"
              class="input-field"
          />
        </div>
        <div class="input-group">
          <label for="weight" class="label">Kaal (kg):</label>
          <input
              v-model="updatePatient.weight"
              type="number"
              id="weight"
              class="input-field"
          />
        </div>
        <button type="submit" class="green-button">Salvesta</button>
      </form>
      <!-- Delete Patient Button -->
      <button class="red-button" @click="deletePatient">Kustuta patsient</button>
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
      updatePatient : {}// Holds patient details
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
            { headers: { Authorization: `Bearer ${token}` } }
        );
        this.patient = response.data;
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
            { headers: { Authorization: `Bearer ${token}` } }
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
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Patsient edukalt kustutatud!");
        this.$router.push("/patients");
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Patsiendi kustutamine ebaõnnestus. Palun proovige uuesti.");
      }
    },
  },
  async mounted() {
    await this.fetchPatientDetails();
  },
};
</script>

<style scoped>
/* Add styles from PatientDetails for consistency */


.patient-details {
  text-align: center;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  margin-top: 1px;
}

.content {
  text-align: center;
  margin-top: 10px;
}

.input-group {
  margin-top: 10px;
  width: 100px;
  max-width: 400px;
  text-align: left;
}

.input-field {
  width: 200px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
}

.green-button {
  background-color: #2ecc71;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s, transform 0.2s;
}

.green-button:hover {
  background-color: #27ae60;
  transform: scale(1.05);
}

.red-button {
  background-color: #e74c3c;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s, transform 0.2s;
}

.red-button:hover {
  background-color: #c0392b;
  transform: scale(1.05);
}
</style>
