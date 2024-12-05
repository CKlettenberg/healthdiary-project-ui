<template>
  <div class="fever-page">
    <div class="top-buttons">
      <button class="simple-btn left" @click="goToSettings">Settings</button>
      <button class="simple-btn right" @click="logout">Logout</button>
    </div>
    <h1>Palaviku mõõtmiste ajalugu</h1>
    <div class="action-buttons">
      <button class="action-btn" @click="showAddFeverForm = true">Lisa mõõtmine</button>
      <button class="action-btn">Eemalda mõõtmine</button>
      <button class="action-btn">Muuda mõõtmine</button>
      <button class="action-btn">Vaata ajalugu</button>
    </div>

    <!-- Lisa palavikuandmete vorm -->
    <div v-if="showAddFeverForm" class="add-fever-form">
      <h2>Lisa uus mõõtmine</h2>
      <form @submit.prevent="addFeverRecord">
        <div>
          <label for="temperature">Temperatuur (°C):</label>
          <input
              type="text"
              id="temperature"
              v-model="newFeverRecord.temperature"
              required
          />
        </div>
        <div>
          <label for="time">Kuupäev ja kellaaeg:</label>
          <input
              type="datetime-local"
              id="time"
              v-model="newFeverRecord.time"
              value="defaultDateTime"
          required
          />
        </div>
        <button type="submit">Salvesta</button>
        <button type="button" @click="cancelAddFever">Tühista</button>
      </form>
    </div>
    <div v-if="feverRecords.length > 0">
      <div>
        <ul>
          <li v-for="(item, index) in feverRecords" :key="index">
            {{ item.id }}
            {{ item.time }}
            {{ item.temperature }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import axios from "axios";

export default {
  data() {
    return {
      feverRecords: [], // Salvestame palavikuandmed
      newFeverRecord: {
        temperature: null,
        time: null,
      },
      showAddFeverForm: false, // Kontrollib, kas "Lisa mõõtmine" vorm on nähtav
    };
  },
  computed: {
    // Vaikimisi kuupäev ja kellaaeg formaadis, mida `datetime-local` aktsepteerib
    defaultDateTime() {
      const now = new Date();
      return now.toISOString().slice(0, 16); // ISO stringi lõikamine, et võtta ainult kuupäev ja kellaaeg
    },
  },
  methods: {
    logout() {
      const authStore = useAuthStore();
      authStore.logout();
      this.$router.push("/");
    },
    async fetchFeverRecords() {
      try {
        const response = await axios.get("http://localhost:8091/api/fever/all");
        this.feverRecords = response.data;
      } catch (error) {
        console.error("Viga palavikuandmete laadimisel:", error);
      }
    },
    async addFeverRecord() {
      try {
        await axios.post("http://localhost:8091/api/fever/new", this.newFeverRecord);
        this.fetchFeverRecords(); // Uuenda loend
        this.cancelAddFever(); // Peida vorm
      } catch (error) {
        console.error("Viga palavikuandme lisamisel:", error);
      }
    },
    submitFeverData() {
      axios.post('/api/fever', this.feverData)
          .then(response => {
            console.log("Andmed edukalt salvestatud:", response.data);
          })
          .catch(error => {
            console.error("Viga andmete salvestamisel:", error);
          });
    },
    cancelAddFever() {
      this.showAddFeverForm = false; // Peida vorm
      this.newFeverRecord = { temperature: null, time: null }; // Lähtesta vorm
    },
  },
  mounted() {
    this.fetchFeverRecords(); // Laadi andmed kohe, kui komponent on loodud
  },
};
</script>

<style scoped>
/* Lisa uue palavikuandme vormi stiilid */
.add-fever-form {
  margin: 20px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.add-fever-form h2 {
  margin-bottom: 10px;
}
.add-fever-form form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.add-fever-form button {
  padding: 8px 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.add-fever-form button:hover {
  background-color: #45a049;
}
</style>