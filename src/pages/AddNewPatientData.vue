<template>
  <div class="add-data-page">
    <!-- Top panel with clock -->
    <div class="top-panel">
      <div class="live-clock">{{ currentTime }}</div>
    </div>

    <!-- Left panel with thermometer -->
    <div class="left-panel">
      <div class="thermometer-container">
        <div class="thermometer">
          <div
              class="thermometer-fill"
              :style="{
              height: `${(temperature - 35) * 100 / 7}%`,
              background: `linear-gradient(to top, #2ecc71 0%, #f1c40f ${
                ((temperature - 35) / 2) * 100
              }%, #e74c3c 100%)`
            }"
          ></div>
        </div>
        <input
            type="range"
            v-model="temperature"
            min="35"
            max="42"
            step="0.1"
            class="temperature-slider"
        />
        <div class="temperature-manual-input">
          <label for="temperature-input">Manuaalne temperatuur:</label>
          <input
              id="temperature-input"
              type="number"
              v-model="temperature"
              min="35"
              max="42"
              step="0.1"
          />
        </div>
        <div class="temperature-display">{{ temperature }}°C</div>
      </div>
    </div>

    <!-- Right panel with symptoms, medications, and additional info -->
    <div class="right-panel">
      <h1 class="title">{{ patient.patientFullName }}</h1>

      <!-- Medications section -->
      <div class="medications">
        <h3>Ravimite lisamine</h3>
        <div class="medication-input">
          <input
              type="text"
              v-model="medication"
              placeholder="Lisa ravim"
              class="med-input"
          />
          <button @click="addMedication" class="small-button">Lisa</button>
        </div>
        <ul>
          <li v-for="(med, index) in medications" :key="index">{{ med }}</li>
        </ul>
      </div>

      <!-- Symptoms checklist -->
      <div class="symptoms">
        <h3>Sümptomid</h3>
        <div class="symptom-grid">
          <label
              v-for="(symptom, index) in symptoms"
              :key="index"
              class="symptom-item"
          >
            <input
                type="checkbox"
                v-model="selectedSymptoms"
                :value="symptom"
            />
            {{ symptom }}
          </label>
        </div>
      </div>

      <!-- Additional info -->
      <textarea
          v-model="additionalInfo"
          class="info-textarea"
          placeholder="Sisesta lisainfot siia..."
      ></textarea>

      <!-- Save button -->
      <button class="save-button" @click="submitData">Salvesta</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      currentTime: "",
      patient: {},
      temperature: 36.5,
      symptoms: ["Köha", "Kurguvalu", "Peavalu", "Kõrge palavik", "Nohu"],
      selectedSymptoms: [],
      medications: [],
      medication: "",
      additionalInfo: "",
    };
  },
  methods: {
    updateCurrentTime() {
      const now = new Date();
      this.currentTime = now.toLocaleString("et-EE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    },
    async fetchPatientDetails() {
      const token = localStorage.getItem("token");
      const patientId = this.$route.params.patientId;

      try {
        const response = await axios.get(
            `http://localhost:8091/api/patients/${patientId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
        );
        this.patient = response.data;
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    },
    addMedication() {
      if (this.medication.trim()) {
        this.medications.push(this.medication.trim());
        this.medication = "";
      }
    },
    async submitData() {
      const token = localStorage.getItem("token");
      const patientId = this.$route.params.patientId;

      const data = {
        symptoms: this.selectedSymptoms,
        medications: this.medications,
        temperature: this.temperature,
        additionalInfo: this.additionalInfo,
        timestamp: new Date().toISOString(),
      };

      try {
        await axios.post(
            `http://localhost:8091/api/patients/${patientId}/add-health-info`,
            data,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Andmed salvestatud!");
        this.$router.push(`/patient/${patientId}`);
      } catch (error) {
        console.error("Error submitting data:", error);
        alert("Andmete salvestamine ebaõnnestus.");
      }
    },
  },
  mounted() {
    this.fetchPatientDetails();
    this.updateCurrentTime();
    setInterval(this.updateCurrentTime, 1000);
  },
};
</script>

<style scoped>
/* General layout */
.add-data-page {
  display: flex;
  flex-direction: row;
  height: 100vh;
  background: #f4f4f4;
}

/* Top panel */
.top-panel {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  text-align: center;
  background: #e9f7ef;
  padding: 10px;
}

.live-clock {
  font-size: 1.5rem;
  color: #333;
}

/* Left panel: Thermometer */
.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #e9f7ef;
}

.thermometer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.thermometer {
  position: relative;
  width: 60px;
  height: 300px;
  background: #ddd;
  border-radius: 30px;
  border: 2px solid #333;
  overflow: hidden;
}

.thermometer-fill {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: linear-gradient(to top,#2ecc71,#e74c3c);
  transition: height 0.3s ease-in-out;
}

.temperature-slider {
  transform: rotate(-90deg);
  width: 200px;
}

.temperature-manual-input {
  display: flex;
  align-items: center;
  gap: 10px;
}

.temperature-display {
  font-size: 1.5rem;
}

/* Right panel */
.right-panel {
  flex: 2;
  padding: 20px;
}

/* Other elements omitted for brevity... */
</style>
