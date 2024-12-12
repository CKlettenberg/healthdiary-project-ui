<template>
  <div class="table-container">
    <h2 class="table-title">Sümptomid</h2>
    <table class="custom-table">
      <thead>
      <tr>
        <th>Kellaaeg</th>
        <th>Sümptomid</th>
        <th>Kustuta</th>
      </tr>
      </thead>
      <tbody v-if="symptoms.length > 0">
      <tr v-for="(record, index) in sortedAndSlicedRecords" :key="index">
        <td>{{ convertToIso(record.timestamp) }}</td>
        <td>{{ record.name }}</td>
        <td><button class="green-button" @click="updateSymptom(record.id)">
          Kustuta</button></td>
      </tr>
      </tbody>
    </table>
    <div class="table-footer" v-if="symptoms.length > visibleCount">
      <button class="green-button" @click="showAll">Kuva rohkem</button>
    </div>
  </div>
</template>
<script>

import axios from "axios";

export default {
  name: "symptomData",
  props: {
    symptoms: {
      type: Array, // Expect an array type
      required: true, // Ensure this prop is mandatory
    },
    patientId: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      visibleCount: 2
    };
  },
  computed: {
    sortedAndSlicedRecords() {
      console.log(this.symptoms)
      return this.symptoms
          .slice()
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, this.visibleCount);
    },
  },
  methods: {
    convertToIso(dateString) {
      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date");
        }
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
    updateSymptom(id) {
      const confirmation = confirm("Olete kindel, et soovite andmeid kustutada?");
      if (!confirmation) return;
      const token = localStorage.getItem("token");
      axios.put(`http://localhost:8091/api/symptoms/delete/${id}`, {}
          , {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            console.log("Andmed edukalt kustutatud:");
            this.$emit('fetch-symptom', '');
          })
          .catch(error => {
            console.error("Viga andmete kustutamisel:", error);
          });
    },
    showAll() {
      // Suurendab nähtavate ridade arvu
      this.visibleCount =this.symptoms.length;
    },
  },
};
</script>

<style>
.delete-button {
  font-size: 18px; /* Your custom font size */
  color: white;
  background-color: #2ecc71;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #27ae60;
}

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
.table-footer {
  display: flex;
  justify-content: flex-end; /* Paigutab sisu paremale */
  margin-top: 10px; /* Lisab vahe tabeli ja nupu vahele */
}
.green-button {
  background-color: #2ecc71; /* Green button */
  color: white;
  padding: 7px 13px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}
.delete-button {
  font-size: 16px; /* Your custom font size */
  color: white;
  background-color: #2ecc71;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #27ae60;
}
.header-cell {
  font-size: 16px; /* Change the font size */
  text-align: center; /* Align the text (left, center, right) */
  vertical-align: middle; /* Align vertically (top, middle, bottom) */
  padding: 10px; /* Adjust padding if needed */
}
.table-data{
  font-size: 16px; /* Change the font size */
  text-align: center; /* Align the text (left, center, right) */
  vertical-align: middle;
}
</style>