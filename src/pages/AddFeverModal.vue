<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <button class="close-btn" @click="closeModal">X</button>
      <div class="modal-content">
        <div class="add-data-page">
          <div class="left-panel">
            <div class="thermometer-container">
              <div class="thermometer">
                <div class="thermometer-fill"
                     :style="{
                  height: `${(newFeverRecord.temperature - 35) * 100 / 7}%`,
              background: `linear-gradient(to top, #70ff50, #d12222{
                {((temperature - 35) / 2) * 100}%, #e74c3c 100%)`
            }"
                ></div>
              </div>
              <input
                  type="range"
                  v-model="newFeverRecord.temperature"
                  min="35"
                  max="42"
                  step="0.1"
                  class="temperature-slider"
              />
              <div class="temperature-display">{{ newFeverRecord.temperature }}°C</div>
            </div>
          </div>

          <div class="right-panel">
            <h1 class="title">{{ patient.patientFullName }}</h1>

            <!-- Lisa palavikuandmete vorm -->
            <div class="add-fever-form">
              <h2>Lisa uus mõõtmine</h2>
              <form @submit.prevent="addFeverRecord">
                <div class="form-group">
                  <label for="temperature">Temperatuur (°C):</label>
                  <input
                      type="text"
                      id="temperature"
                      v-model="newFeverRecord.temperature"
                      min="35"
                      max="42"
                      step="0.1"
                      required
                  />
                </div>
                <div class="form-group">
                  <label for="time">Kuupäev ja kellaaeg:</label>
                  <div v-if="!isEditingDateTime" class="date-time-display">
                    <span>{{ formattedDateTime }}</span>
                    <button type="button" class="btn-edit" @click="isEditingDateTime = true">Muuda</button>
                  </div>
                  <div v-else>
                    <vue3-datepicker
                        v-model="newFeverRecord.time"
                        :enable-time-picker="true"
                        format="dd/MM/yyyy HH:mm"
                        :append-to-body="true"
                        placement="bottom-start"
                        required
                    />
                  </div>
                </div>
                <div class="medication-panel">
                  <div class="form-group">
                    <label for="medicationName">Manustatud palaviku alandajat:</label>
                    <input placeholder="ravimi nimetus või toimeaine"
                           type="text"
                           id="medicationName"
                           v-model="newFeverRecord.medicationName"
                    />
                  </div>
                  <div class="form-group">
                    <label for="medicationDosage">Manustatud palaviku alandaja doos:</label>
                    <input placeholder="ravimi annus (näiteks 20 ml,  1 tablett 500 mg)"
                           type="text"
                           id="medicationDosage"
                           v-model="newFeverRecord.medicationDosage"
                    />
                  </div>
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn-submit">Salvesta</button>
                  <button type="button" @click="cancelAddFever" class="btn-cancel">Tühista</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import dayjs from "dayjs";
import axios from "axios";
import Vue3Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  name: "add-fever-data",
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
      patient: {},
      isEditingDateTime: false,
      newFeverRecord: {
        temperature: 36.6,
        time: dayjs().toISOString(),
        medicationName: "",
        medicationDosage: "",
      },
    };
  },
  computed: {
    formattedDateTime() {
      return dayjs(this.newFeverRecord.time).format("DD/MM/YYYY HH:mm");
    },
  },
  methods: {
    async fetchPatientDetails() {
      const token = localStorage.getItem("token");
      const patientId = this.$route.params.patientId;
      try {
        const response = await axios.get(
            `http://192.168.1.40:8091/api/patients/${patientId}`,
            {
              headers: {Authorization: `Bearer ${token}`},
            }
        );
        this.patient = response.data;
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    },
    async addFeverRecord() {
      try {
        const patientId = this.patientId;
        this.newFeverRecord.patientId = patientId;
        await axios.post("http://192.168.1.40:8091/api/fever/new", this.newFeverRecord);
        this.$emit("fetch-fever", "");
        this.newFeverRecord.temperature = 36.6
        this.closeModal();
      } catch (error) {
        console.error("Viga palavikuandmete lisamisel:", error);
      }
    },
    cancelAddFever() {
      this.newFeverRecord.temperature = 36.5;
      this.newFeverRecord.time = dayjs().toISOString();
      this.newFeverRecord.medicationName = "";
      this.newFeverRecord.medicationDosage = "";
      this.closeModal();
    },
    closeModal() {
      this.$emit("update:isOpen", false);
    },
  },
  mounted() {
    this.fetchPatientDetails();
  },
};
</script>

<style scoped>
.add-data-page {
  display: flex;
  flex-direction: row;
  height: 100%;
  background: #f4f4f4;
}

.add-fever-form {
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
  padding: 8px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
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
  font-size: 1.1rem;
  color: #555;
}

.left-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.thermometer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  position: relative;
}

.temperature-slider {
  -webkit-appearance: none;
  width: 300px; /* Height of the slider when rotated */
  height: 20px; /* Thickness of the slider */
  border-style: double;
  border-width: 5px;
  background: linear-gradient(to right, #2ecc71, #f1c40f, #e74c3c);
  /* Gradient */
  border-radius: 20px;
  outline: none;
  cursor: pointer;
  transform: rotate(-90deg); /* Vertical orientation */
  margin: 20px 0; /* Space around the slider */
}

.temperature-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px; /* Thumb width */
  height: 50px; /* Thumb height */
  background: radial-gradient(white, black); /* Dark color for the thumb */
  border-radius: 10px;
  cursor: pointer;
}

.temperature-slider::-moz-range-thumb {
  width: 20px; /* Thumb width */
  height: 50px; /* Thumb height */
  background: #333; /* Dark color for the thumb */
  border-radius: 10px;
  cursor: pointer;
}

.temperature-display {
  font-size: 1.5rem;
  margin-left: -120px;
  margin-top: -60px;
}

.right-panel {
  flex: 2;
  padding: 20px;
}

@media (max-width: 767px) {
  .modal {
    width: 95%;
    max-width: 95%; /* Ensure it doesn't exceed screen width */
    height: auto; /* Allow height to adjust */
    max-height: 90%; /* Limit the height */
    overflow-y: auto; /* Enable scrolling for content */
    padding: 20px;
    border-radius: 8px; /* Slightly smaller radius */
  }

  .modal-content {
    font-size: 1rem; /* Adjust font size for readability */
    margin-top: 10px;
  }

  .add-data-page {
    flex-direction: column; /* Stack panels vertically */
    gap: 20px; /* Add space between panels */
    height: auto; /* Adjust height based on content */
  }

  .left-panel,
  .right-panel {
    flex: none;
    width: 100%;
    padding: 0; /* Remove extra padding */
    align-items: center;
    justify-content: center;
  }

  .thermometer-container {
    width: 100%;
    gap: 10px; /* Add spacing between elements */
  }

  .temperature-slider {
    width: 100%; /* Make slider responsive */
    transform: none; /* Reset rotation */
    margin: 10px 0; /* Adjust spacing */
  }

  .temperature-display {
    margin: 0; /* Center the display */
    text-align: center;
    font-size: 1.2rem; /* Slightly smaller font */
  }

  .add-fever-form {
    width: 100%;
    max-width: 100%; /* Ensure it fits mobile screens */
    padding: 10px;
    box-shadow: none; /* Simplify the design for mobile */
  }

  h2 {
    font-size: 1.4rem; /* Adjust title size */
    margin-bottom: 10px;
  }

  .form-group label {
    font-size: 0.9rem; /* Smaller labels */
  }

  input[type="text"], input[type="datetime-local"] {
    font-size: 0.9rem; /* Adjust input size */
    padding: 6px;
  }

  .form-actions {
    flex-direction: column; /* Stack buttons vertically */
    gap: 10px;
    align-items: stretch;
  }

  .btn-submit,
  .btn-cancel {
    width: 100%; /* Full-width buttons */
    font-size: 1rem; /* Slightly smaller font */
    padding: 10px;
  }

  .temperature-slider::-webkit-slider-thumb,
  .temperature-slider::-moz-range-thumb {
    width: 20px; /* Reduce thumb size */
    height: 20px;
  }

  .close-btn {
    font-size: 1.2rem; /* Slightly smaller close button */
    top: 10px;
    right: 10px;
  }
}

</style>
