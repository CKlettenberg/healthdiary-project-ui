<template>
  <!-- Lisa palavikuandmete vorm -->
  <div class="add-fever-form">
    <h2>Lisa uus mõõtmine</h2>
    <form @submit.prevent="addFeverRecord">
      <div>
        <label for="temperature">Temperatuur (°C):</label>
        <input
            type="text"
            id="temperature"
            v-model="newFeverRecord.temperature"
            required
        />
      </div>
      <div>
        <label for="time">Kuupäev ja kellaaeg:</label>
        <input
            type="datetime-local"
            id="time"
            v-model="newFeverRecord.time"
            required
        />
      </div>
      <button type="submit">Salvesta</button>
      <button type="button" @click="cancelAddFever">Tühista</button>
    </form>
  </div>
  <div v-if="getPatientFeverRecords.length > 0">
    <div>
      <li v-for="(item, index) in getPatientFeverRecords" :key="index">
        {{ item.id }}
        {{ item.time }}
        {{ item.temperature }}
      </li>
    </div>
  </div>

</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      getPatientFeverRecords: [],
      newFeverRecord: {
        temperature: '',
        time: ''
      }
    };
  },
  methods: {
       async addFeverRecord() {
         try {
           const patientId = this.patientId;
           this.newFeverRecord.patientId = patientId;
           await axios.post("http://localhost:8091/api/fever/new", this.newFeverRecord);
           // Optional: Uncomment if these are required
           // await this.fetchFeverRecords(); // Update the list
           // this.cancelAddFever(); // Hide the form
           this.$router.push(`/patient/${patientId}`); // Use template literals
         } catch (error) {
           console.error("Viga palavikuandme lisamisel:", error);
         }
    },
    cancelAddFever() {
      this.newFeverRecord.temperature = '';
      this.newFeverRecord.time = '';
    }
  },
  mounted() {
    this.patientId = this.$route.params.patientId;
  }
};
</script>

<style>
/* Add your styles here */
</style>
