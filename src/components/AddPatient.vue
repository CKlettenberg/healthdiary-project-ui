<template>
  <div class="add-patient-page">
    <!-- Top Buttons -->
    <div class="top-buttons">
      <button class="icon-button back" @click="goBack">
        <i class="fas fa-arrow-left"></i>
      </button>
      <button class="icon-button logout" @click="logout">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>

    <!-- Add Patient Form -->
    <div class="add-patient-form">
      <h2 class="title">Lisa Andmed</h2>
      <form @submit.prevent="handleAddPatient" class="form-container">
        <div class="input-group">
          <label for="patientFullName" class="label">Nimi:</label>
          <input
              v-model="patient.patientFullName"
              type="text"
              id="patientFullName"
              class="input-field"
              required
          />
        </div>
        <div class="input-group">
          <label for="dob" class="label">Sünniaeg:</label>
          <input
              v-model="patient.dateOfBirth"
              type="date"
              id="dob"
              class="input-field"
              required
          />
        </div>
        <div class="input-group">
          <label for="weight" class="label">Kaal (kg):</label>
          <input
              v-model="patient.weight"
              type="number"
              id="weight"
              class="input-field"
              required
          />
        </div>
        <button type="submit" class="green-button">Salvesta Patsient</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

export default {
  data() {
    return {
      patient: {
        patientFullName: "",
        dateOfBirth: "",
        weight: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    async handleAddPatient() {
      const userId = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (!userId) {
        this.errorMessage = "Kasutaja ei ole autentitud. Palun logige sisse.";
        return;
      }

      try {
        const payload = {
          ...this.patient,
          userId: userId,
        };

        await axios.post("http://localhost:8091/api/patients", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        alert(`Patsient ${this.patient.patientFullName} edukalt lisatud!`);
        this.$router.push("/menu");
      } catch (error) {
        this.errorMessage =
            error.response && error.response.status === 400
                ? "Vigased andmed. Palun kontrollige vormi."
                : "Midagi läks valesti. Palun proovige uuesti.";
      }
    },
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push("/");
    },
    goBack() {
      this.$router.push("/menu");
    },
  },
};
</script>

<style scoped>
/* Updated styles for visual consistency */
.add-patient-page {
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

.add-patient-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
  max-width: 400px;
}

.title {
  font-size: 2.5rem;
  color: #ffffff; /* White text */
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.7); /* Shadow for contrast */
  margin-bottom: 30px;
  text-align: center;
}

.input-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.label {
  font-size: 1.2rem;
  color: #ffffff; /* White label text */
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 25px;
  font-size: 1.1rem;
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent input background */
  color: #333;
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

.error-message {
  color: red;
  font-size: 1rem;
  margin-top: 10px;
  text-align: center;
}

@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }

  .input-field {
    font-size: 1rem;
  }

  .green-button {
    font-size: 1rem;
  }
}
</style>
