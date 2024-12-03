import { createRouter, createWebHistory } from "vue-router";
import LoginScreen from "../components/LoginScreen.vue";
import MenuPage from "../components/MenuPage.vue";

const routes = [
    {
        path: "/", // Default route
        name: "Login",
        component: LoginScreen, // Login screen as the first page
    },
    {
        path: "/menu", // Menu page route
        name: "Menu",
        component: MenuPage,
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;
