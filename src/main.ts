import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import App from "./App.vue";
import "./assets/styles/base.css";
import router from "./router";
import i18n from "./locales/i18n.ts";
import { setupFontAwesome } from "#/assets/styles/font-awesome";

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(pinia).use(ElementPlus).use(i18n).use(router);
setupFontAwesome(app);

// /* Swiper */
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/swiper-bundle.css";
app.component("Swiper", Swiper);
app.component("SwiperSlide", SwiperSlide);

app.mount("#app");
