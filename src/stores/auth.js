import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isAuthenticated: !!localStorage.getItem("token") && localStorage.getItem("token") !== "undefined",
        token: null,
        }),
    actions: {
        login(user) {
            this.isAuthenticated = true;
            localStorage.setItem("token", user.token)
            localStorage.setItem("user", user.userId);
        },
        logout() {
            this.isAuthenticated = false;
            this.user = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    },
});
