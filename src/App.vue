<template>

  <div class="health-diary-app">
    <!-- Top Buttons -->

    <div v-if="!isLoggedIn" class="router-view-container">
      <div v-if="isAuthenticated" class="top-buttons">
        <button class="icon-button back" @click="goToMenu">
          <i class="fas fa-home"></i>Pealeht
        </button>
        <button class="icon-button logout" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>Logi välja
        </button>
      </div>
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
  name: "App",
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
      this.$router.push("/patients");
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
