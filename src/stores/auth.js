import {defineStore} from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isAuthenticated: !!localStorage.getItem("token") && localStorage.getItem("token") !== "undefined",
        token: localStorage.getItem("token") || null, 
    }),
    actions: {
        login(user) {
            this.isAuthenticated = true;
            this.token = user.token;
            localStorage.setItem("token", user.token); 
            localStorage.setItem("user", user.userId); 
        },
        logout(router) {
            this.isAuthenticated = false;
            this.token = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            router.push('/login'); 
        },
    },
});
