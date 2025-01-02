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
    navigateBack() {
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

.error-message {
  color: red;
  font-size: 1rem;
  margin-top: 10px;
  text-align: center;
}

@media (max-width: 767px) {
  .title {
    margin-top: 100px;
  }
}

</style>
