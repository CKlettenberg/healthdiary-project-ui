import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth"; // Ensure this points to your Pinia store
import LoginScreen from "@/components/LoginScreen.vue";
import MenuPage from "@/pages/MenuPage.vue";
import RegisterScreen from "@/components/RegisterScreen.vue";
import AddPatient from "@/components/AddPatient.vue";
import FeverPage from "@/pages/FeverPage.vue";
import PatientDetails from "@/pages/PatientDetails.vue";
import PatientsList from "@/pages/PatientsList.vue";

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
    {
        path: "/fever",
        name: "FeverRecord",
        component: FeverPage,
        meta: { requiresAuth: true },
    },
    {
        path: "/patient/:patientId",
        name: "PatientDetails",
        component: PatientDetails,
        props: true, // Pass `patientId` as a prop
        meta: { requiresAuth: true },
    },
    {
        path: "/patients",
        name: "PatientsList",
        component: PatientsList,
        meta: { requiresAuth: true },
    },
    {
        path: "/:pathMatch(.*)*", // Catch-all route
        redirect: "/",
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard for Authentication
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    // Redirect to login if the route requires authentication and the user isn't authenticated
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ path: "/", query: { redirect: to.fullPath } }); // Redirect to login with the intended path
    } else {
        next();
    }
});

export default router;
