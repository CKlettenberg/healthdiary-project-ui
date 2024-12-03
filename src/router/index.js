import { createRouter, createWebHistory } from 'vue-router';
import MenuPage from '@/pages/MenuPage.vue'; // Import your home page component

const routes = [
    { path: '/', component: MenuPage },
    // other routes
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;