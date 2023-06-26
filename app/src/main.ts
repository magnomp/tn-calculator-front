import { createApp } from "vue";
import { pinia } from "./stores";
import App from "./App.vue";
import router from "./router";

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { useAuthStore } from "./stores/auth";
import { useAuthTokenStore } from "./stores/authToken";
import { aliases, mdi } from "vuetify/iconsets/mdi";

const app = createApp(App);

const vuetify = createVuetify({
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  components,
  directives,
});

app.use(pinia);

const authTokenStore = useAuthTokenStore();

authTokenStore.refresh().finally(() => {
  app.use(router);
  app.use(vuetify);

  app.mount("#app");
});
