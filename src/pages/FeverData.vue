<template>
  <div class="table-container">
    <h2 class="table-title">Temperatuur ja ravimid</h2>
    <table class="custom-table">
      <thead>
      <tr>
        <th class="header-cell">Kuupäev ja kellaaeg</th>
        <th class="header-cell">Temperatuur (°C)</th>
        <th class="header-cell">Ravimi nimetus</th>
        <th class="header-cell">Ravimi doos</th>
        <th class="header-cell">Kustuta</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(entry, index) in sortedAndSlicedRecords" :key="index">
        <td class="table-data" data-label="Kuupäev ja kellaaeg">{{ convertToIso(entry.time) }}</td>
        <td class="table-data" data-label="Temperatuur (°C)">{{ entry.temperature }} (°C)</td>
        <td class="table-data" data-label="Ravimi nimetus">{{ entry.medicationName }}</td>
        <td class="table-data" data-label="Ravimi doos">{{ entry.medicationDosage }}</td>
        <td class="table-data" data-label="Kustuta">
          <div class="edit-buttons">
            <button class="delete-button" @click="deleteFeverRecord(entry.id)">Kustuta</button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <div class="table-footer">
      <button v-if="feverRecords.length > 0" class="secondary-button" @click="downloadPDF">Lae alla pdf</button>
      <button v-if="feverRecords.length > visibleCount" class="secondary-button" @click="showAll">Kuva rohkem</button>
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
    },
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
      const confirmation = confirm("Olete kindel, et soovite andmeid kustutada?");
      if (!confirmation) return;
      const token = localStorage.getItem("token");
      axios.put(`http://192.168.1.40:8091/api/fever/delete/${id}`
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
    updateFeverRecord(entry) {
      this.$emit('update-fever', [entry]);
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
            const pageCount = pdf.getNumberOfPages();
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.height;
            for (let i=1; i <= pageCount; i++) {
              pdf.setPage(1);
              pdf.setFontSize(13);
              pdf.setTextColor(40);
              pdf.text("Tervise päeviku andmed seisuga: " + formattedDate, pageWidth / 2, 1, {align: "center"});
              pdf.text("Nimi: " + selectedName, 2, 1.5, {align: "left"});
              pdf.setPage(pageCount);
              pdf.setFontSize(13);
              pdf.text("Aitäh, et kasutasite Tervise päevikut enda haiguse jälgimisel!",
                  pdf.internal.pageSize.getWidth() / 2, pageHeight - 1, {
                    align: "center",
                  });
            }
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

.secondary-button {
  justify-content: space-evenly;
  margin-top: 10px;
  margin-bottom: 0px;
}
.delete-button {
  text-align: center;
  font-size: 1rem;
  padding: 6px 12px;
}

.edit-buttons {
  display: flex;
  justify-content: space-between;
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
}

.custom-table th {
  background-color: #2ecc71;
  text-align: center;
  color: #ffffff;
  font-weight: bold;
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

.header-cell {
  font-size: 16px;
  text-align: center;
  vertical-align: middle;
  padding: 10px;
}

.table-data {
  font-size: 17px;
  text-align: center;
  vertical-align: middle;
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

  .custom-table th,
  .custom-table td {
    padding: 8px 10px;
    text-align: left;
    word-wrap: break-word;
  }

  .custom-table th {
    font-size: 0.9rem;
  }

  .custom-table tr:hover {
    background-color: #f2f2f2; /* Subtle hover effect */
  }

  .header-cell,
  .table-data {
    text-align: left;
    font-size: 1rem;
    padding: 2px;
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

  /* Hide Table Header for Narrow Screens and Stack Data */
  .custom-table thead {
    display: none;
  }

  .custom-table tr {
    display: flex;
    flex-direction: column; /* Stack cells vertically */
    margin-bottom: 20px;
    border: 1px solid #ddd; /* Add border around each entry */
    border-radius: 5px;
    background-color: #fff;
  }

  .custom-table td {
    display: flex;
    justify-content: space-between;
    padding: 3px 25px 3px 25px;
    border: none; /* Remove inner borders */
  }

  .custom-table td::before {
    content: attr(data-label); /* Add label for each cell */
    font-weight: bold;
    flex: 0 0 40%;
    text-align: left;
  }
  .custom-table tr:nth-child(odd) {
    background-color: #ebffe8;
    border-radius: 25px;
  }

  .custom-table tr:nth-child(even) {
    background-color: #ffffff;
    border-radius: 25px;
  }
}

</style>
