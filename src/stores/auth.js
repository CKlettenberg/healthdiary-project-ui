import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        isAuthenticated: !!localStorage.getItem("user") && localStorage.getItem("user") !== "undefined", // Check for both existence and validity
        user: (() => {
            const user = localStorage.getItem("user");
            // Ensure the value is neither null nor the string "undefined"
            if (user && user !== "undefined") {
                try {
                    return JSON.parse(user);
                } catch (error) {
                    console.error("Failed to parse user data from localStorage:", error);
                }
            }
            return null; // Default to null if invalid
        })(),
    }),
    actions: {
        login(user) {
            console.log(user)
            this.isAuthenticated = true;
            this.user = user.user.id;
            console.log(user.user.id, 'userId')
            localStorage.setItem("user", user.user.id); // Persist user data
        },
        logout() {
            this.isAuthenticated = false;
            this.user = null;
            localStorage.removeItem("user"); // Remove from localStorage
        },
    },
});
