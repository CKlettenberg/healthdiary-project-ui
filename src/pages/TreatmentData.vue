<template>
  <div class="table-container">
    <h2 class="table-title">Palavikurohud ja sümptomid</h2>
    <table class="custom-table">
    <thead>
    <tr>
      <th>Kellaaeg</th>
      <th>Ravimi nimi</th>
      <th>Kogus</th>
      <th>Sümptomid</th>
      <th>Kustuta</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(record, index) in sortedAndSlicedRecords" :key="index">
      <td>{{ convertToIso(record.timestamp) }}</td>
      <td>{{ record.medicine }}</td>
      <td>{{ record.dosage }}</td>
      <td>{{ record.symptoms.join(', ') }}</td>
      <td>{{ record.timestamp }}</td>
      <td><button class="green-button" @click="deleteTreatmentRecord(record.id)">
        Kustuta</button></td>
    </tr>
    </tbody>
  </table>
    <div class="table-footer" v-if="treatmentRecords.length > visibleCount">
      <button class="green-button" @click="showAll">Kuva rohkem</button>
    </div>
</div>
</template>
<script>

import axios from "axios";

export default {
  name: "treatmentData",
  props: {
    treatmentRecords: {
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
      visibleCount: 5,
      newTreatmentRecord: {
        medicine: "",
        dosage: "",
        symptoms: [],
        timestamp: "", // Lisatakse automaatselt
      },
      symptomList: ["Nohu", "Köha", "Iiveldus/oksendamine", "Peavalu", "Liigesvalu", "Kõhuvalu"],
    };
  },
  computed: {
    sortedAndSlicedRecords() {
            return this.treatmentRecords
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
    deleteTreatmentRecord(id) {
      const confirmation = confirm("Olete kindel, et soovite andmeid kustutada?");
      if (!confirmation) return;
      const token = localStorage.getItem("token");
      axios.put(`http://localhost:8091/api/treatment/delete/${id}`, {}
          , {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(() => {
            console.log("Andmed edukalt kustutatud:");
            this.$emit('fetch-treatment', '');
          })
          .catch(error => {
            console.error("Viga andmete kustutamisel:", error);
          });
    },
    showAll() {
      // Suurendab nähtavate ridade arvu
      this.visibleCount =this.treatmentRecords.length;
    },
    },
};
</script>


<style>
.treatment-records {
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