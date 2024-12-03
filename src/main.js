import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Import Pinia
import App from './App.vue';
import router from './router';

const app = createApp(App);

// Create Pinia instance
const pinia = createPinia();

// Use Pinia as a plugin
app.use(pinia);
app.use(router);

app.mount('#app');
