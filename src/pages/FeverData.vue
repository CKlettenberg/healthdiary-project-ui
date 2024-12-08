<template>
  <div class="table-container">
  <h2 class="table-title">Temperatuuri ajalugu</h2>
  <table class="custom-table">
    <thead>
    <tr>
      <th>Aeg</th>
      <th>Temperatuur (°C)</th>

      <th>Kustuta</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(entry, index) in feverRecords" :key="index">

      <td>{{ convertToIso(entry.time) }}</td>
      <td>{{ entry.temperature }} (°C) </td>
      <td><button @click="deleteFeverRecord(entry.id)">
        Kustuta</button></td>
    </tr>
    </tbody>
  </table>
  </div>
</template>

<script>

import axios from "axios";

export default {
  name: "feverData",
  props: {
    feverRecords: {
      type: Array, // Expect an array type
      required: true, // Ensure this prop is mandatory
    },
    patientId: {
      type: Number,
      required: true
    }
  },

  methods: {
    convertToIso(dateString) {
      try {
        const date = new Date(`${dateString}Z`); // Add `Z` to indicate UTC
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date");
        }
        console.log(date.toISOString())
        const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, '.');
        const formattedTime = date.toLocaleTimeString("en-GB", {
          hour: '2-digit',
          minute: '2-digit'
        });
        return `${formattedDate} ${formattedTime}`;
      } catch {
        return "Invalid date format!";
      }
    },
    deleteFeverRecord(id) {
      const token = localStorage.getItem("token");
      axios.put(`http://localhost:8091/api/fever/delete/${id}`
          , {
       headers: { Authorization: `Bearer ${token}` },
      })
          .then(() => {
            console.log("Andmed edukalt kustutatud:");
            this.$emit('fetch-fever', '');
          })
          .catch(error => {
            console.error("Viga andmete kustutamisel:", error);
          });
    },
    }
  }

</script>

<style scoped>
/* Container Styles */
.table-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

/* Title Styles */
.table-title {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 16px;
  color: #333;
}

/* Table Styles */
.custom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.custom-table th,
.custom-table td {
  padding: 12px 16px;
  border: 1px solid #ddd;
}

/* Header Row Styles */
.custom-table th {
  background-color: #2ecc71;
  color: #ffffff;
  font-weight: bold;
}

/* Body Row Styles */
.custom-table tr:nth-child(odd) {
  background-color: #f9f9f9;
}

.custom-table tr:nth-child(even) {
  background-color: #ffffff;
}

.custom-table tr:hover {
  background-color: #e6f7ff;
}/* Additional Custom Styling if Needed */
</style>