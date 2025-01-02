<template>
  <div>
    <div class="menu-content">
      <h1 class="title">Tervise päevik</h1>
      <div class="action-buttons">
        <button class="green-button" @click="navigateToAddPatient">Lisa patsient</button>
      </div>
      <div v-if="!patients.length" class="no-patients">
        <p>Patsiente pole leitud. Vajutage "Lisa patsient", et luua uus patsient.</p>
      </div>
      <div v-else>
        <h2 class="title">Kõik patsiendid</h2>
        <ul class="patients-list">
          <li v-for="patient in patients" :key="patient.id" @click="viewPatient(patient.id)">
            {{ patient.patientFullName }}
          </li>
        </ul>
      </div>
    </div>
    <div class="action-buttons">
      <button class="secondary-button" @click="navigateBack">Tagasi</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      patients: [],
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
        this.patients = response.data;
      } catch (error) {
        console.error("Error fetching patients:", error);
        alert("Failed to load patients. Please try again.");
      }
    },
    navigateToAddPatient() {
      this.$router.push("/add-patient");
    },
    viewPatient(patientId) {
      this.$router.push(`/patient/${patientId}`);
    },
    navigateBack() {
      window.history.back();
    }
  },

  mounted() {
    this.fetchPatients();
  },
};
</script>

<style scoped>
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
  font-size: 2rem;
}

.patients-list li:hover {
  background-color: #2ecc71;
  color: white;
}

.green-button {
  width: 400px;
  height: 60px;
  padding: 12px 25px;
  font-size: 2rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.no-patients {
  margin-top: 20px;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7);
  text-align: center;
}

</style>
