<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <button class="close-btn" @click="closeModal">X</button>
      <div class="modal-content">
        <div class="add-symptom-form">
          <h2>Lisa sümptomid</h2>
          <form @submit.prevent="saveSymptoms">
            <div class="form-group symptoms-group">
              <h3>Sümptomid:</h3>
              <label for="symptoms">Tee oma valik:</label>
              <div v-for="(symptom, index) in symptomList" :key="index">
                <label class="hover-over-label">
                  <input type="checkbox" v-model="newSymptom.symptoms" :value="symptom"/>{{ symptom.name }}
                </label>
              </div>
              <label v-if="hasOther()" for="other-symptom">Sisesta kirjeldus:</label>
              <input type="text" v-if="hasOther()" v-model="newSymptom.otherSymptom"/>
            </div>
            <div class="form-group">
              <label for="time">Kuupäev ja kellaaeg:</label>
              <div v-if="!isEditingDateTime" class="date-time-display">
                <span>{{ formattedDateTime }}</span>
                <button type="button" class="btn-edit"
                        @click="isEditingDateTime = true">Muuda
                </button>
              </div>
              <div v-else>
                <vue3-datepicker
                    v-model="newSymptom.time"
                    :enable-time-picker="true"
                    format="dd/MM/yyyy HH:mm"
                    :append-to-body="true"
                    placement="bottom-start"
                    required
                />
                <button type="button" class="btn-edit" @click="isEditingDateTime = false">Salvesta</button>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" @click="saveSymptoms" class="btn-submit">Salvesta</button>
              <button type="button" @click="cancelSaveSymptoms" class="btn-cancel">Tühista</button>
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
  components: {Vue3Datepicker},
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
      isEditingDateTime: false,
      newSymptom: {
        time: dayjs().format("YYYY-MM-DDTHH:mm"),
        patientId: this.patientId || null,
        symptoms: [],
        otherSymptom: "",
      },
      symptomList: [
        {id: 1, name: "Nohu"},
        {id: 2, name: "Köha"},
        {id: 3, name: "Peavalu"},
        {id: 4, name: "Lihasvalu"},
        {id: 5, name: "Kõhuvalu"},
        {id: 6, name: "Iiveldus/oksendamine"},
        {id: 7, name: "Muu"},
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
      if (!this.newSymptom.symptoms || this.newSymptom.symptoms.length === 0) {
        alert("Please select at least one symptom.");
        return;
      }
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
        this.newSymptom.time = dayjs().format("YYYY-MM-DDTHH:mm");
        this.newSymptom.symptoms = [];
        this.isEditingDateTime = false;
        this.closeModal();
        this.$emit("fetch-symptoms", "");
      } catch (error) {
        console.error("Error saving symptom:", error.response?.data || error.message);
        alert("Error saving symptom.");
      }
    },
    hasOther() {
      return this.newSymptom.symptoms.some(sym => sym.name === 'Muu');
    },
    cancelSaveSymptoms() {
      this.newSymptom.time = dayjs().format("YYYY-MM-DDTHH:mm");
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

.symptoms-group {
  margin-bottom: 15px;
}

.symptoms-group label {
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  margin-bottom: 5px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-size: 1rem;
  color: #555;
  margin-bottom: 5px;
}

input[type="text"], input[type="datetime-local"] {
  width: 100%;
  padding: 12px;
  border-radius: 25px;
  font-size: 1.3rem;
  background-color: rgba(255, 255, 255, 0.8);
  color: #333;
  border-style: double;
  box-sizing: border-box;
}

input[type="text"]:focus, input[type="datetime-local"]:focus {
  border-color: #4CAF50;
  outline: none;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-submit {
  background-color: #4CAF50;
  color: white;
}

.btn-submit:hover {
  background-color: #45a049;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
}

.btn-cancel:hover {
  background-color: #e53935;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  background-color: #f1f1f1;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  justify-content: space-between;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6); /* Slightly darker for better contrast */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Ensure the modal stays on top */
}

.modal {
  background: #ffffff;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 800px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  animation: modal-in 0.3s ease-out;
}

@keyframes modal-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  border: none;
  background: transparent;
  font-size: 20px;
  color: #888;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #333; /* Darker color on hover */
}

.modal-content {
  margin-top: 20px;
  font-size: 1.3rem;
  color: darkred;
}

</style>
