<template>
  <div id="app">
    <!-- Top Buttons -->
    <div class="top-buttons" v-if="isAuthenticated">
      <button class="icon-button back" @click="goToMenu">
        <i class="fas fa-home"></i>Pealeht
      </button>
      <button class="icon-button logout" @click="handleLogout">
        <i class="fas fa-sign-out-alt"></i>Logi välja
      </button>
    </div>
    <div v-if="!isLoggedIn">
      <router-view></router-view>
    </div>
    <div v-else>

    </div>
  </div>
</template>


<script>

import {useAuthStore} from "@/stores/auth";
import {useRouter} from "vue-router";

export default {
  components: {},
  setup() {
    const router = useRouter(); // Use useRouter here
    const authStore = useAuthStore();

    const handleLogout = () => {
      console.log('logging out', router)
      authStore.logout(router); // Pass the router instance to the store's logout action
    };

    return {
      handleLogout
    };
  },
  data() {
    return {
      isLoggedIn: false
    };
  },
  methods: {
    goToMenu() {
      this.$router.push("/menu");
    }
  },
  computed: {
    isAuthenticated() {
      const authStore = useAuthStore();
      return authStore.isAuthenticated;
    },
  },
};
</script>
<style>

.top-buttons {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 10px;
  width: 95%;
}

.icon-button {
  background-color: transparent;
  border: none;
  color: #ffffff; /* White color for icons */
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.3s, color 0.3s;
}

.icon-button:hover {
  transform: scale(1.2); /* Slight zoom effect */
  color: #2ecc71; /* Green on hover */
}
</style>