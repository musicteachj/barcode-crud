import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";

import axios from "axios";
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(vuetify);
app.use(router);

app.mount("#app");
