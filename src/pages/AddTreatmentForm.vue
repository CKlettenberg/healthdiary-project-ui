<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal">
      <button class="close-btn" @click="closeModal">X</button>
      <div class="modal-content">
        <!-- Palavikurohtude ja sümptomite vorm -->
        <div class="add-treatment-form">
          <h2>Lisa palavikurohud ja sümptomid</h2>
          <form @submit.prevent="addTreatmentRecord">
            <div class="form-group">
              <label for="medicine">Palavikurohud:</label>
              <input
                  type="text"
                  id="medicine"
                  v-model="newTreatmentRecord.medicine"
                  placeholder="Sisesta ravimi nimi"
              />
            </div>
            <div class="form-group">
              <label for="dosage">Ravimi kogus:</label>
              <input
                  type="text"
                  id="dosage"
                  v-model="newTreatmentRecord.dosage"
                  placeholder="Sisesta kogus (nt 1 tablett, 5 ml)"
              />
            </div>
            <div class="form-group symptoms-group">
              <h3>Sümptomid:</h3>
              <div v-for="(symptom, index) in symptomList" :key="index">
                <label>
                  <input
                      type="checkbox"
                      v-model="newTreatmentRecord.symptoms"
                      :value="symptom"
                  />
                  {{ symptom }}
                </label>
              </div>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn-submit">Salvesta</button>
              <button type="button" @click="cancelAddTreatment" class="btn-cancel">Tühista</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "add-symptoms-data",
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
      newTreatmentRecord: {
        medicine: "",
        symptoms: [],
      },
      symptomList: ["Nohu", "Köha", "Iiveldus/oksendamine", "Peavalu", "Liigesvalu", "Kõhuvalu"],
    };
  },
  methods: {
    async addTreatmentRecord() {
      try {
        const record = {
          ...this.newTreatmentRecord,
          patientId: this.patientId,
        };
        await axios.post("http://localhost:8091/api/treatment/new", record);
        this.$emit("fetch-treatments", ''); // Teavita vanemat uute andmete küsimisest
        this.closeModal();
      } catch (error) {
        console.error("Viga andmete lisamisel:", error);
      }
    },
    cancelAddTreatment() {
      this.newTreatmentRecord.medicine = "";
      this.newTreatmentRecord.symptoms = [];
      this.closemo();
    },
    closeModal() {
      this.$emit("update:isOpen", false);
    },
  },
};
</script>
<style>
.add-treatment-form {
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
</style>