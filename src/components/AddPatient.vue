<template>
  <div class="add-patient-page">
    <div class="top-buttons">
      <button class="simple-btn left" @click="goBack">Back</button>
      <button class="simple-btn right" @click="logout">Logout</button>
    </div>

    <div class="add-patient-form">
      <h2>Lisa andmed</h2>
      <form @submit.prevent="handleAddPatient">
        <div class="input-group">
          <label for="patientFullName" class="label">Name:</label>
          <input
              v-model="patient.patientFullName"
              type="text"
              id="patientFullName"
              class="input-field"
              required
          />
        </div>
        <div class="input-group">
          <label for="dob" class="label">Date of Birth:</label>
          <input
              v-model="patient.dateOfBirth"
              type="date"
              id="dob"
              class="input-field"
              required
          />
        </div>
        <div class="input-group">
          <label for="weight" class="label">Weight (kg):</label>
          <input
              v-model="patient.weight"
              type="number"
              id="weight"
              class="input-field"
              required
          />
        </div>
        <button type="submit" class="green-button">Save Patient</button>
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
      const authStore = useAuthStore();
      console.log(authStore)
      const user = authStore.user; // Get the authenticated user from the store

      if (!user) {
        this.errorMessage = "User not authenticated. Please log in.";
        return;
      }

      try {
        // Include user ID in the request payload
        const payload = {
          ...this.patient,
          userId: user.id, // Assuming `user.id` is available
        };

        await axios.post("http://localhost:8091/api/patients", payload, {
          headers: {
            Authorization: `Bearer ${user}`, // Include token in headers
          },
        });

        alert(`Patient ${this.patient.patientFullName} added successfully!`);
        this.$router.push("/menu");
      } catch (error) {
        this.errorMessage =
            error.response && error.response.status === 400
                ? "Invalid input. Please check the form."
                : "Something went wrong. Please try again.";
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
/* Existing styles */
</style>
