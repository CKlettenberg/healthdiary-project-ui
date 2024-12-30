<template>
  <div class="health-diary-app">
    <div class="add-patient-form">
      <h2 class="title">Lisa uue patsiendi andmed</h2>
      <form @submit.prevent="handleAddPatient" class="form-container">
        <div class="input-group">
          <label for="patientFullName" class="label">Nimi:</label>
          <input
              v-model="patient.patientFullName"
              autocomplete="off"
              id="patientFullName"
              class="input-field"
              required
          />

          <label for="dob" class="label">Sünniaeg:</label>
          <input
              v-model="patient.dateOfBirth"
              type="date"
              id="dob"
              class="input-field"
              required
          />

          <label for="weight" class="label">Kaal (kg):</label>
          <input
              v-model="patient.weight"
              type="number"
              id="weight"
              class="input-field"
              required
          />
        </div>
        <button type="submit" class="green-button">Salvesta patsient</button>
      </form>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

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
    goBack() {
      this.$router.push("/menu");
    },
  },
};
</script>

<style scoped>

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
  color: #a1ff2e;
  text-shadow: 0 2px 4px rgba(0.4, 0.5, 0.7, 4);
  margin-bottom: 30px;
}

.input-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

}

.label {
  font-size: 1.2rem;
  color: #0e0c0c;
  margin-bottom: 8px;
}

.input-field {
  width: 100%;
  padding: 12px;
  border-radius: 25px;
  font-size: 1.1rem;
  background-color: rgba(255, 255, 255, 0.8);
  color: #333;
  border-style: double;
}

.green-button {
  gap: 15px;
  background-color: #2ecc71;
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.green-button:hover {
  background-color: #27ae60;
  transform: scale(1.05);
}

.error-message {
  color: red;
  font-size: 1rem;
  margin-top: 10px;
  text-align: center;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.4rem;
    margin-top: 100px;
  }

  .input-field {
    font-size: 1.5rem;
  }

  .green-button {
    font-size: 1.5rem;
  }
}
</style>
