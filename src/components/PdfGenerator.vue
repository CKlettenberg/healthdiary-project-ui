<template>
  <div class="pdf-viewer">
    <div id="pdf-content" class="pdf-container">
      <h1 class="text-center">Tervise päeviku palaviku andmed</h1>
      <p class="text-center">See on PDF-faili sisu eelvaade.</p>
    </div>
    <div class="top-buttons">
      <button class="icon-button" @click="downloadPDF">Lae alla PDF</button>
    </div>
  </div>
</template>

<script>
import html2pdf from "html2pdf.js";  // Impordi html2pdf.js

export default {
  name: "PdfViewer",
  data() {
    return {
      selectedName: "", // Asenda dünaamiliste andmetega
      selectedDates: "", // Asenda dünaamiliste andmetega
    };
  },
  methods: {
    downloadPDF() {
      const pdfContent = document.querySelector(".pdf-container");

      if (!pdfContent) {
        console.error("Element .pdf-container ei leitud!");
        return;
      }
      const selectedName = this.selectedName;
      const selectedDates = this.selectedDates;

      const options = {
        margin: [3.5, 2, 2, 2],
        filename: "haiguse-detailid.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
          unit: "cm",
          format: "a4",
          orientation: "portrait",
        },
      };

      html2pdf()
          .from(pdfContent)  // Kasuta õiget elementi
          .set(options)
          .toPdf()
          .get("pdf")
          .then((pdf) => {
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.height;

            // Lisa kohandatud päis
            pdf.setFontSize(12);
            pdf.setTextColor(40);
            pdf.text("Tervise päevik", pageWidth - 1, 1, { align: "right" });

            // Lisa dünaamiline nimi ja kuupäevad
            pdf.text("Nimi: " + selectedName, pageWidth - 1, 1.5, { align: "right" });
            pdf.text("Kuupäevad: " + selectedDates, pageWidth - 1, 2, { align: "left" });

            pdf.setLineWidth(0.05); // Joone paksus
            pdf.line(1, 2.5, pageWidth - 1, 2.5); // Joon vasakult paremale äärele

            // Lisa jalus
            pdf.setFontSize(10);
            pdf.text("Aitäh, et kasutasite Tervise päevikut enda haiguste jälgimisel!", pdf.internal.pageSize.getWidth() / 2, pageHeight - 1, {
              align: "center",
            });

            pdf.save("Tervisepäevik.pdf");
          });
    },
  }
};
</script>

<style scoped>
.pdf-viewer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.pdf-container {
  width: 90%;
  max-width: 800px;
  height: auto;
  padding: 20px;
  background-color: white; /* PDF eelvaate taust */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  text-align: center;
  overflow-y: auto; /* Kui PDF eelvaade on liiga pikk, saab kerida */
}

.pdf-container h1,
.pdf-container p {
  margin: 10px 0;
}

.icon-button {
  background-color: #c5db34; /* Sinine nupp */
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.icon-button:hover {
  background-color: #2980b9; /* Tumedam sinine hover efekt */
  transform: scale(1.05);
}
</style>
