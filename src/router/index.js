import {createRouter, createWebHistory} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import LoginScreen from "@/components/LoginScreen.vue";
import MenuPage from "@/pages/MenuPage.vue";
import RegisterScreen from "@/components/RegisterScreen.vue";
import AddPatient from "@/components/AddPatient.vue";
import PatientDetails from "@/pages/PatientDetails.vue";
import PatientsList from "@/pages/PatientsList.vue";
import AddFeverForm from "@/pages/AddFeverModal.vue";
import EditPatient from "@/pages/EditPatient.vue";
import AddSymptomForm from "@/pages/AddSymptomModal.vue";

const routes = [
    {
        path: "/",
        name: "Menu",
        component: MenuPage,
        meta: {requiresAuth: true},
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
        meta: {requiresAuth: true},
    },
    {
        path: "/add-fever/:patientId",
        name: "AddFeverRecord",
        component: AddFeverForm,
        meta: {requiresAuth: true},
    },
    {
        path: "/patient/:patientId",
        name: "PatientDetails",
        component: PatientDetails,
        props: true,
        meta: {requiresAuth: true},
    },
    {
        path: "/patients",
        name: "PatientsList",
        component: PatientsList,
        meta: {requiresAuth: true},
    },
    {
        path: "/:pathMatch(.*)*",
        redirect: "/",
    },
    {
        path: "/edit-patient-page/:patientId",
        name: "EditPatient",
        component: EditPatient,
        props: true,
    },
    {
        path: "/add-symptoms",
        name: "AddSymptoms",
        component: AddSymptomForm,
        meta: {requiresAuth: true},
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next({path: "/login", query: {redirect: to.fullPath}});
    } else {
        next();
    }
});

export default router;
