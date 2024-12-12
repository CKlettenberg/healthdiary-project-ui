<template>
  <div class="table-container">
    <h2 class="table-title">Temperatuur ja ravimid</h2> <div>
    <PdfGenerator />
  </div>

    <table class="custom-table">
      <thead>
      <tr>
        <th class="header-cell">Kellaaeg</th>
        <th class="header-cell">Temperatuur (°C)</th>
        <th class="header-cell">Ravimi nimetus</th>
        <th class="header-cell">Ravimi doos</th>
        <th class="header-cell">Kustuta</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(entry, index) in sortedAndSlicedRecords" :key="index">

        <td class="table-data">{{ convertToIso(entry.time) }}</td>
        <td class="table-data">{{ entry.temperature }} (°C) </td>
        <td class="table-data">{{ entry.medicationName }} </td>
        <td class="table-data">{{ entry.medicationDosage }} </td>
        <td class="table-data"><button class="delete-button" @click="deleteFeverRecord(entry.id)" >
          Kustuta</button></td>
      </tr>
      </tbody>
    </table>

    <div class="table-footer" v-if="feverRecords.length > visibleCount">
      <button class="green-button" @click="showAll">Kuva rohkem</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import PdfGenerator from "@/components/PdfGenerator.vue";

export default {
  name: "feverData",
  components: {PdfGenerator},
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
  data() {
    return {
      visibleCount: 5,
    };
  },
  computed: {
    sortedAndSlicedRecords() {
      // Tagastab andmed tagurpidi järjestuses sorteeritult kronoloogiliselt ja lõikab nähtavate kirjete arvu järgi
      return this.feverRecords
          .slice()
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, this.visibleCount);
    },
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
      const confirmation = confirm("Olete kindel, et soovite palavikku kustutada?");
      if (!confirmation) return;
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
    showAll() {
      // Suurendab nähtavate ridade arvu
      this.visibleCount =this.feverRecords.length;
    },
  },
}
</script>

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