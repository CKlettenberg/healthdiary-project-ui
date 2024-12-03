<template>
  <div id="app">
    <div v-if="!isLoggedIn">
      <router-view></router-view>
    </div>
    <div v-else>

    </div>
  </div>
</template>


<script>

export default {
  components: {},
  data() {
    return {
      isLoggedIn: false // Initial state is not logged in
    };
  },
  methods: {
    handleLoginSuccess() {
      this.isLoggedIn = true;

      // Redirect to the home page
      this.$router.push('/');
    }
  }
};
</script>