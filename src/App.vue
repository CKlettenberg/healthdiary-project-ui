<template>
  <div id="app">
    <div v-if="!isLoggedIn">
      <LoginForm @login-success="handleLoginSuccess" />
    </div>
    <div v-else>
      <ShoppingCart />
    </div>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginScreen.vue";
import ShoppingCart from "@/pages/MenuPage.vue";

export default {
  components: {
    LoginForm,
    ShoppingCart
  },
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