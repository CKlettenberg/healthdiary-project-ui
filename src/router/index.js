import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LoginScreen from "@/components/LoginScreen.vue";
import MenuPage from "@/pages/MenuPage.vue";
import RegisterScreen from "@/components/RegisterScreen.vue";
import AddPatient from "@/components/AddPatient.vue";
import PatientDetails from "@/pages/PatientDetails.vue";
import PatientsList from "@/pages/PatientsList.vue";
import AddNewPatientData from "@/pages/AddNewPatientData.vue";
import AddFeverForm from "@/pages/AddFeverForm.vue";

import AddTreatmentForm from "@/pages/AddTreatmentForm.vue";
import EditPatient from "@/pages/EditPatient.vue";

const routes = [
    {
        path: "/",
        name: "Menu",
        component: MenuPage,
        meta: { requiresAuth: true },
    },
    {
        path: "/login",
        name: "Login",
        component: LoginScreen,
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
        path: "/add-fever/:patientId",
        name: "AddFeverRecord",
        component: AddFeverForm,
        meta: { requiresAuth: true },
    },
    {
        path: "/patient/:patientId",
        name: "PatientDetails",
        component: PatientDetails,
        props: true,
        meta: { requiresAuth: true },
    },
    {
        path: "/patients",
        name: "PatientsList",
        component: PatientsList,
        meta: { requiresAuth: true },
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: "/",
    },
    {
        path: "/add-health-info/:patientId",
        name: "AddNewPatientData",
        component: AddNewPatientData,
        meta: { requiresAuth: true }, // Optional: Add authentication guard
    },
    {
        path: "/edit-patient-page/:patientId",
        name: "EditPatient",
        component: EditPatient,
        props: true, // Ensure props are passed to the component
    },
    {
    path: "/add-treatment-data",
    name: "AddTreatment",
    component: AddTreatmentForm,
    meta: { requiresAuth: true },
},


];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    // If the route requires authentication and the user is not authenticated, redirect to login
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({ path: "/login", query: { redirect: to.fullPath } });
    } else {
        next(); // Allow navigation if authentication is not required or the user is logged in
    }
});

export default router;
