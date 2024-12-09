<template>
  <div v-if="treatmentRecords.length > 0" class="treatment-records">
  <h2>Palavikurohud ja sümptomid</h2>
  <table>
    <thead>
    <tr>
      <th>Ravimi nimi</th>
      <th>Kogus</th>
      <th>Sümptomid</th>
      <th>Kellaaeg</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(record, index) in treatmentRecords" :key="index">
      <td>{{ record.medicine }}</td>
      <td>{{ record.dosage }}</td>
      <td>{{ record.symptoms.join(', ') }}</td>
      <td>{{ record.timestamp }}</td>
    </tr>
    </tbody>
  </table>
</div>
</template>
<script>
import axios from "axios";

export default {
  name: "add-treatment-data",
  props: {
    patientId: {
      type: Number,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      treatmentRecords: [], // Salvestatud ravimi- ja sümptomite andmed
      newTreatmentRecord: {
        medicine: "",
        dosage: "",
        symptoms: [],
        timestamp: "", // Lisatakse automaatselt
      },
      symptomList: ["Nohu", "Köha", "Iiveldus/oksendamine", "Peavalu", "Liigesvalu", "Kõhuvalu"],
    };
  },
  methods: {
    async addTreatmentRecord() {
      try {
        const record = {
          ...this.newTreatmentRecord,
          patientId: this.patientId,
          timestamp: new Date().toISOString(), // Lisa automaatselt andmete lisamise aeg
        };
        await axios.post("http://localhost:8091/api/treatment/new", record);
        this.fetchTreatmentRecords(); // Uuenda kuvamiseks
        this.closeModal();
      } catch (error) {
        console.error("Viga andmete lisamisel:", error);
      }
    },
    cancelAddTreatment() {
      this.newTreatmentRecord.medicine = "";
      this.newTreatmentRecord.dosage = "";
      this.newTreatmentRecord.symptoms = [];
      this.closeModal();
    },
    async fetchTreatmentRecords() {
      try {
        const response = await axios.get(`http://localhost:8091/api/treatment/${this.patientId}`);
        this.treatmentRecords = response.data;
      } catch (error) {
        console.error("Viga ravimiandmete küsimisel:", error);
      }
    },
    closeModal() {
      this.$emit("update:isOpen", false);
    },
  },
  mounted() {
    this.fetchTreatmentRecords(); // Kutsu andmed kohe pärast komponendi laadimist
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