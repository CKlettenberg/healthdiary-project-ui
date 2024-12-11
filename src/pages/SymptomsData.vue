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
.symptoms {
  margin-top: 30px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

thead {
  background-color: #f9f9f9;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  font-weight: bold;
  color: #333;
}

tr:nth-child(even) {
  background-color: #f1f1f1;
}

tr:hover {
  background-color: #ddd;
}

</style>