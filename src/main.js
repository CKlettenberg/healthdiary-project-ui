import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Import Pinia
import App from './App.vue';
import router from './router';
import './assets/global.css';

// Create the app instance
const app = createApp(App);

// Create Pinia instance
const pinia = createPinia();

// Use Pinia and router
app.use(pinia);
app.use(router);

// Mount the app
app.mount('#app');
