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
        <td>
          <button class="delete-button" @click="updateSymptom(record.id)">Kustuta</button>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="table-footer" v-if="symptoms.length > visibleCount">
      <button class="secondary-button" @click="showAll">Kuva rohkem</button>
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

.secondary-button {
  margin-top: 10px;
  margin-bottom: 0px;
}
.delete-button {
  text-align: center;
  font-size: 1rem;
  padding: 6px 12px;
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

.table-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 10px;
  color: #333;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.custom-table th,
.custom-table td {
  padding: 5px 16px;
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
  font-size: 17px;
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

@media (max-width: 767px) {
  .table-container {
    max-width: 100%;
    margin: 10px;
    padding: 12px;
    border: none; /* Remove border for a cleaner mobile look */
    box-shadow: none; /* Simplify the layout */
  }

  .table-title {
    font-size: 1.3rem;
    margin-bottom: 10px;
  }

  .custom-table {
    font-size: 0.8rem;
    border-collapse: collapse;
    width: 100%;
    overflow-x: auto;
    display: block; /* Allow table to scroll horizontally */
  }
  .custom-table tr:nth-child(odd) {
    background-color: #ebffe8;
  }

  .custom-table tr:nth-child(even) {
    background-color: #ffffff;
  }

  /* Make Delete Button Smaller */
  .delete-button {
    font-size: 0.8rem;
    padding: 2px 10px;
  }

  .secondary-button {
    font-size: 0.9rem;
    padding: 8px 15px;
    width: 100%; /* Full width on smaller screens */
  }
}
</style>