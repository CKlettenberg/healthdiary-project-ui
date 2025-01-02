<template>
  <div class="table-container">
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
        <td>
          <button class="delete-button" @click="updateSymptom(record.id)">Kustuta</button>
        </td>
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
      type: Array,
      required: true,
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
            headers: {Authorization: `Bearer ${token}`},
          })
          .then(() => {
            this.$emit('fetch-symptom', '');
          })
          .catch(error => {
            console.error("Viga andmete kustutamisel:", error);
          });
    },
    showAll() {
      this.visibleCount = this.symptoms.length;
    },
  },
};
</script>

<style scoped>
.delete-button {
  font-size: 18px;
  color: white;
  background-color: #22df74;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  cursor: pointer;
}

.delete-button:hover {
  background-color: #aa1a1a;
}

.table-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
}

.custom-table th,
.custom-table td {
  padding: 12px 16px;
  border: 1px solid #ddd;
  text-align: center;
  font-size: 17px;
  vertical-align: middle;
}

.custom-table th {
  background-color: #2ecc71;
  text-align: center;
  color: #ffffff;
  font-weight: bold;
  font-size: 19px;
}

.custom-table tr:nth-child(odd) {
  background-color: #ebffe8;

}

.custom-table tr:nth-child(even) {
  background-color: #ffffff;
}

.custom-table tr:hover {
  background-color: #e6f7ff;
}

.table-footer {
  display: flex;
  justify-content: space-around;
}

.green-button {
  background-color: #2ecc71;
  color: white;
  padding: 7px 13px;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}
</style>