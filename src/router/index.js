import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LoginScreen from "@/components/LoginScreen.vue";
import MenuPage from "@/pages/MenuPage.vue";

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
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next("/");
    } else {
        next();
    }
});

export default router;
