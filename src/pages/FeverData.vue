<template>
  <div class="table-container">
    <h2 class="table-title">Temperatuur ja ravimid</h2>
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
        <td class="table-data">{{ entry.temperature }} (°C)</td>
        <td class="table-data">{{ entry.medicationName }}</td>
        <td class="table-data">{{ entry.medicationDosage }}</td>
        <td class="table-data">
          <button class="delete-button" @click="deleteFeverRecord(entry.id)">Kustuta</button>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="table-footer">
      <button v-if="feverRecords.length > 0" class="green-button" @click="downloadPDF">Lae alla pdf</button>
      <button v-if="feverRecords.length > visibleCount" class="green-button" @click="showAll">Kuva rohkem</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import html2pdf from "html2pdf.js";

export default {
  name: "feverData",
  props: {
    feverRecords: {
      type: Array,
      required: true,
    },
    patient: {
      type: {},
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
        const date = new Date(`${dateString}Z`);
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
    deleteFeverRecord(id) {
      const confirmation = confirm("Olete kindel, et soovite palavikku kustutada?");
      if (!confirmation) return;
      const token = localStorage.getItem("token");
      axios.put(`http://localhost:8091/api/fever/delete/${id}`
          , {
            headers: {Authorization: `Bearer ${token}`},
          })
          .then(() => {
            this.$emit('fetch-fever', '');
          })
          .catch(error => {
            console.error("Viga andmete kustutamisel:", error);
          });
    },
    showAll() {
      this.visibleCount = this.feverRecords.length;
    },
    downloadPDF() {
      const table = document.querySelector(".custom-table");
      const pdfContent = table.cloneNode(true);
      if (!pdfContent) {
        console.error("Elementi ei leitud!");
        return;
      }
      this.removeDeleteColumn(pdfContent);
      const selectedName = this.patient.patientFullName;
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0'); // Ensures two digits (e.g., 01, 02)
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
      const year = currentDate.getFullYear();
      const formattedDate = `${day}.${month}.${year}`;
      const options = {
        margin: [2, 2, 2, 2],
        html2canvas: {scale: 2},
        jsPDF: {
          unit: "cm",
          format: "a4",
          orientation: "portrait",
        },
      };
      html2pdf()
          .from(pdfContent)
          .set(options)
          .toPdf()
          .get("pdf")
          .then((pdf) => {
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.height;
            pdf.setFontSize(13);
            pdf.setTextColor(40);
            pdf.text("Tervise päevik - " + formattedDate, pageWidth / 2, 1, {align: "center"});
            pdf.text("Nimi: " + selectedName, 2, 1.5, {align: "left"});
            pdf.setFontSize(13);
            pdf.text("Aitäh, et kasutasite Tervise päevikut!",
                pdf.internal.pageSize.getWidth() / 2, pageHeight - 1, {
                  align: "center",
                });
            pdf.save("Tervisepäevik.pdf");
          });
    },
    removeDeleteColumn(table) {
      const headers = table.querySelectorAll('th');
      const deleteColumnIndex = Array.from(headers).findIndex(header => header.textContent.trim() === 'Kustuta');
      if (deleteColumnIndex !== -1) {
        headers[deleteColumnIndex].remove();
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells[deleteColumnIndex]) {
            cells[deleteColumnIndex].remove();
          }
        });
      }
    }
  },
}
</script>

<style scoped>
.delete-button {
  font-size: 18px;
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

.table-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.table-title {
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 16px;
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
  padding: 12px 16px;
  border: 1px solid #ddd;
}

.custom-table th {
  background-color: #2ecc71;
  color: #ffffff;
  font-weight: bold;
}

.custom-table tr:nth-child(odd) {
  background-color: #f9f9f9;
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
  margin-top: 10px;
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

.delete-button {
  font-size: 16px;
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
  font-size: 16px;
  text-align: center;
  vertical-align: middle;
  padding: 10px;
}

.table-data {
  font-size: 16px;
  text-align: center;
  vertical-align: middle;
}
</style>