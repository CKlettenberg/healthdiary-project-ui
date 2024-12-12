<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <button class="close-btn" @click="closeModal">X</button>
      <div class="modal-content">
        <!-- Sümptomite vorm -->
        <div class="add-symptom-form">
          <h2>Valikuline: lisa sümptomid</h2>
          <form @submit.prevent="saveSymptoms">
            <div class="form-group symptoms-group">
              <h3>Sümptomid:</h3>
                <label for="symptoms">Tee oma valik:</label>
              <div v-for="(symptom, index) in symptomList" :key="index">
                  <label class="hover-over-label">
                    <input type="checkbox" v-model="newSymptom.symptoms" :value="symptom" />
                    {{ symptom.name }}
                  </label>

              </div>
              <label v-if="hasOther()" for="other-symptom">Sisesta kirjeldus:</label>
              <input type="text" v-if="hasOther()" v-model="newSymptom.otherSymptom"/>
              </div>
            <div class="form-group">
              <label for="time">Kuupäev ja kellaaeg:</label>
              <div v-if="!isEditingDateTime" class="date-time-display">
                <span>{{ formattedDateTime }}</span>
                <button
                    type="button"
                    class="btn-edit"
                    @click="isEditingDateTime = true"
                >
                  Muuda
                </button>
              </div>
              <div v-else>
                <vue3-datepicker
                    v-model="newSymptom.time"
                    :enable-time-picker="true"
                    format="dd/mm/yyyy HH:mm"
                    :append-to-body="true"
                    placement="bottom-start"
                    required
                />
                <button
                    type="button"
                    class="btn-edit"
                    @click="isEditingDateTime = false"
                >
                  Salvesta
                </button>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" @click="saveSymptoms" class="btn-submit">
                Salvesta
              </button>
              <button
                  type="button"
                  @click="cancelSaveSymptoms"
                  class="btn-cancel"
              >
                Tühista
              </button>
            </div>
          </form>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import axios from "axios";
import Vue3Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import dayjs from "dayjs";


export default {
  name: "add-symptom-data",
  components: { Vue3Datepicker },
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
      isEditingDateTime: false, // Controls whether the datepicker is visible
      newSymptom: {
        time: dayjs().format("YYYY-MM-DDTHH:mm"), // Default to local time in ISO format
        patientId: this.patientId || null,
        symptoms: [],
        otherSymptom: "",
      },
      symptomList: [
        { id: 1, name: "Nohu" },
        { id: 2, name: "Köha" },
        { id: 3, name: "Peavalu" },
        { id: 4, name: "Lihasvalu" },
        { id: 5, name: "Kõhuvalu" },
        { id: 6, name: "Iiveldus/oksendamine" },
        { id: 7, name: "Muu" },
      ],
    };
  },
  computed: {
    formattedDateTime() {
      return dayjs(this.newSymptom.time).format("DD/MM/YYYY HH:mm");
    },
  },
  methods: {
    async saveSymptoms() {
      console.log(this.newSymptom)
      if (!this.newSymptom.symptoms || this.newSymptom.symptoms.length === 0) {
        alert("Please select at least one symptom.");
        return;
      }
      console.log(this.newSymptom)
      if (!this.newSymptom.time) {
        alert("Please provide valid timestamps.");
        return;
      }
      try {
        await axios.post(`http://localhost:8091/api/symptoms/new`,
            {
              specificSymptomList: this.newSymptom.symptoms,
              otherSymptom: this.newSymptom.otherSymptom,
              time: this.newSymptom.time,
              patientId: this.patientId,
            }
        );
        this.newSymptom.time = dayjs().format("YYYY-MM-DDTHH:mm"); // Reset to current local time
        this.newSymptom.symptoms = [];
        this.isEditingDateTime = false; // Reset edit state
        this.closeModal();
        this.$emit("fetch-symptoms", ""); // Notify parent to refresh data
      } catch (error) {
        console.error("Error saving symptom:", error.response?.data || error.message);
        alert("Error saving symptom.");
      }
    },
    hasOther() {
      return this.newSymptom.symptoms.some(sym => sym.name === 'Muu');
    },
    cancelSaveSymptoms() {
      this.newSymptom.time = dayjs().format("YYYY-MM-DDTHH:mm"); // Reset to local time
      this.newSymptom.symptoms = [];
      this.isEditingDateTime = false; // Reset edit state
      this.closeModal();
    },
    closeModal() {
      this.$emit("update:isOpen", false);
    },
  }
}
</script>

<style>
.add-symptom-form {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #555;
}

.symptoms-group {
  margin-bottom: 15px;
}

.symptoms-group label {
  display: flex;
  align-items: center;
  font-size: 1rem;
  margin-bottom: 5px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

label {
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-bottom: 10px;
  cursor: pointer;
}

/* Style the checkbox itself */
input[type="checkbox"] {
  margin-right: 10px;
  accent-color: #4CAF50; /* Change color of checkbox (green in this case) */
  width: 20px;
  height: 20px;
  cursor: pointer;
}

/* Optional: Add a hover effect on the label */
.hover-over-label:hover {
  background-color: #f1f1f1;
  border-radius: 5px;
  padding: 5px;
}

input[type="text"], input[type="password"], input[type="email"], input[type="number"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 5px;
  box-sizing: border-box; /* Ensures padding is included in width */
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

/* Focus effect */
input[type="text"]:focus, input[type="password"]:focus, input[type="email"]:focus, input[type="number"]:focus {
  border-color: #4CAF50; /* Change border color on focus */
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.5); /* Add glow effect on focus */
  outline: none; /* Remove default focus outline */
}

/* Optional: Style for invalid input */
input:invalid {
  border-color: #f44336; /* Red border for invalid input */
}

input:valid {
  border-color: #4CAF50; /* Green border for valid input */
}
</style>
