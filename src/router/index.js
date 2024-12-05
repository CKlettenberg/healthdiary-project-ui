import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LoginScreen from "@/components/LoginScreen.vue";
import MenuPage from "@/pages/MenuPage.vue";
import RegisterScreen from "@/components/RegisterScreen.vue";
import AddPatient from "@/components/AddPatient.vue"; // Import AddPatient component

const routes = [
    {
        path: "/",
        component: LoginScreen,
    },
    {
        path: "/menu",
        component: MenuPage,
        meta: { requiresAuth: true },
    },
    {
        path: "/register",
        name: "Register",
        component: RegisterScreen,
    },
    {
        path: "/add-patient",
        name: "AddPatient",
        component: AddPatient,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    // Redirect to login if the route requires authentication and the user isn't authenticated
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next("/");
    } else {
        next();
    }
});

export default router;
