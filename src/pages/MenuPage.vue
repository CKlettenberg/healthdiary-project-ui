<template>
  <div @touchstart="startTouch" @touchmove="moveTouch">
    <div class="menu-content">
      <h1 class="title">Tervise päevik</h1>
      <div class="action-buttons">
        <button class="green-button" @click="navigateToAddPatient">Lisa patsient</button>
        <button class="green-button" @click="navigateToPatients">Kõik patsiendid</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      patients: [],
      startX: 0,
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
      try {
        const response = await axios.get(`http://localhost:8091/api/patients/all-patients/by-user-id/${userId}`, {
          headers: {Authorization: `Bearer ${token}`},
        });
        this.patients = response.data.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
      } catch (error) {
        console.error("Error fetching patients:", error);
        alert("Failed to load patients. Please try again.");
      }
    },
    startTouch(event) {
      this.startX = event.touches[0].clientX; // Record the starting touch position
    },
    moveTouch(event) {
      const endX = event.touches[0].clientX; // Record the ending touch position
      const diffX = this.startX - endX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          this.navigateToLastModifiedPatient();
        }
        this.startX = 0;
      }
    },
    navigateToAddPatient() {
      this.$router.push("/add-patient");
    },
    navigateToPatients() {
      this.$router.push("/patients");
    },
    navigateToLastModifiedPatient() {
      if (this.patients.length > 0) {
        const lastModifiedPatient = this.patients[0]; // Get the most recently modified patient
        this.$router.push(`/patient/${lastModifiedPatient.id}`);
      } else {
        alert("No patients available.");
      }
    },
    openSettings() {
      alert("Settings page will be implemented soon!");
    },
  },
  mounted() {
    this.fetchPatients();
  },
};
</script>

<style scoped>
.menu-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  text-align: center;
}


.green-button {
  width: 400px;
  font-size: 2rem;
  }

.green-button:hover {
  background-color: #66ff3f;
  transform: scale(1.05);
}

</style>
