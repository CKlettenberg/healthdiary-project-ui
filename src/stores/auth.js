import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isAuthenticated: !!localStorage.getItem("token") && localStorage.getItem("token") !== "undefined",
        token: localStorage.getItem("token") || null, // Ensure token is fetched on store load
    }),
    actions: {
        login(user) {
            this.isAuthenticated = true;
            this.token = user.token;
            localStorage.setItem("token", user.token); // Store the token
            localStorage.setItem("user", user.userId); // Store user ID
        },
        logout(router) {
            this.isAuthenticated = false;
            this.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            router.push('/login'); // Navigate to home page
        },
    },
});