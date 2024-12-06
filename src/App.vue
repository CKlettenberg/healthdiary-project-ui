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
      isLoggedIn: false
    };
  },
  methods: {
    handleLoginSuccess() {
      this.isLoggedIn = true;


      this.$router.push('/');
    }
  }
};
</script>