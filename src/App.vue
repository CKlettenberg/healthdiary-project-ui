<template>
  <div class="health-diary-app">
    <!-- Top Buttons -->

    <div v-if="!isLoggedIn" class="router-view-container">
      <div v-if="isAuthenticated" class="top-buttons">
        <button class="icon-button back" @click="goToMenu">
          <i class="fas fa-home"></i>Pealeht
        </button>
        <div class="dropdown-container">
        <!-- Peamine nupp -->
        <button @click="toggleDropdown" class="icon-button">Seaded</button>
        <ul v-if="isDropdownOpen" class="dropdown-menu">
          <li @click="navigateToChangePassword" class="icon-button">Muuda parooli</li>
          <li @click="handleLogout" class="icon-button logout">Logi välja</li>
        </ul>
      </div>
      </div>
      <router-view></router-view>
    </div>
    <div v-else>

    </div>
  </div>
</template>


<script>

import {useAuthStore} from "@/stores/auth";

export default {
  name: "App",
  data() {
    return {
      isLoggedIn: false,
      isDropdownOpen: false
    };

  },
  methods: {
    goToMenu() {
      this.$router.push("/patients");
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    navigateToChangePassword() {
      this.isDropdownOpen= false;
      this.$router.push("/change-password");
    },
    handleLogout() {
      this.isDropdownOpen = false; // Sulge rippmenüü
      const authStore = useAuthStore();
      authStore.logout(this.$router); // Logi välja
    },
    handleOutsideClick(event) {
      const dropdown = this.$el.querySelector(".dropdown-container");
      if (dropdown && !dropdown.contains(event.target)) {
        this.isDropdownOpen = false; // Sulge rippmenüü, kui klikiti väljaspool
      }
    },
    cleanupDropdown() {
      console.log("Komponent eemaldatakse, rippmenüü suletakse.");
      this.isDropdownOpen = false; // Sulge rippmenüü
    }
  },
  computed: {
    isAuthenticated() {
      const authStore = useAuthStore();
      return authStore.isAuthenticated;
    },
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleOutsideClick);
    this.cleanupDropdown();
  }
  };
</script>
