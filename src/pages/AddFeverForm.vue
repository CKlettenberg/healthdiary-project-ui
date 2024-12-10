<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <button class="close-btn" @click="closeModal">X</button>
      <div class="modal-content">
        <div class="add-data-page">

          <div class="left-panel">
            <div class="thermometer-container">
              <div class="thermometer">
                <div
                    class="thermometer-fill"
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

          <!-- Right panel with symptoms, medications, and additional info -->
          <div class="right-panel">

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
                  <input
                      type="datetime-local"
                      id="time"
                      v-model="newFeverRecord.time"
                      required
                  />
                </div>
                <div class="form-actions">
                  <button type="submit" class="btn-submit">Salvesta</button>
                  <button type="button" @click="cancelAddFever" class="btn-cancel">Tühista</button>
                </div>
              </form>
            </div>

            <div v-if="getPatientFeverRecords.length > 0" class="fever-records">
              <ul>
                <li v-for="(item, index) in getPatientFeverRecords" :key="index">
                  <span class="record-id">{{ item.id }}</span>
                  <span class="record-time">{{ item.time }}</span>
                  <span class="record-temperature">{{ item.temperature }} °C</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import axios from "axios";

export default {
  name: 'add-fever-data',
  props: {
    patientId: {
      type: Number,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      getPatientFeverRecords: [],
      temperature: 36.5,
      newFeverRecord: {
        temperature: 36.5,
        time: ''
      }
    };
  },
  methods: {
    async addFeverRecord() {
      try {
        const patientId = this.patientId;
        this.newFeverRecord.patientId = patientId;
        await axios.post("http://localhost:8091/api/fever/new", this.newFeverRecord);
        this.$emit('fetch-fever', '');
        this.closeModal();
      } catch (error) {
        console.error("Viga palavikuandme lisamisel:", error);
      }
    },
    cancelAddFever() {
      this.newFeverRecord.temperature = '';
      this.newFeverRecord.time = '';
      this.closeModal();
    },
    watch: {
      // Kui temperatuur muutub termomeetri või liuguri kaudu
      temperature(newValue) {
        this.newFeverRecord.temperature = newValue;
      },
      // Kui temperatuur muutub vormi sisestusvälja kaudu
      'newFeverRecord.temperature'(newValue) {
        this.temperature = newValue;
      }
    },
    openModal() {
      this.$emit('update:isOpen', true);
    },
    closeModal() {
      this.$emit('update:isOpen', false);
    }
  },
};
</script>

<style>
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

.fever-records {
  margin-top: 30px;
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
  display: flex;
  justify-content: space-between;
}

.record-id,
.record-time,
.record-temperature {
  font-size: 1rem;
  color: #333;
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

/* Temperature controls */
.temperature-controls {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.temperature-input {
  width: 100px;
  text-align: center;
  font-size: 1rem;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 5px;
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
</style>
