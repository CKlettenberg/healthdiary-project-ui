import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // Ensure router is imported

const app = createApp(App);

app.use(router); // Ensure router is added here
app.mount("#app");
