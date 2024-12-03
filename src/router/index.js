import { createRouter, createWebHistory } from "vue-router";
import LoginScreen from "../components/LoginScreen.vue";
import MenuPage from "../pages/MenuPage.vue";

const routes = [
    {
        path: "/",
        name: "Login",
        component: LoginScreen,
    },
    {
        path: "/menu",
        name: "Menu",
        component: MenuPage,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
