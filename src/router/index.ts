import { createRouter, createWebHistory,RouteRecordRaw  } from "vue-router";
import Home from "#/pages/home.vue";
import Logs from "#/pages/logs.vue";
import Rules from "#/pages/rules.vue";
import Model from  "#/pages/model.vue";

const routes: RouteRecordRaw[]= [

  {
    path: "",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { title: "Homepage", hideFooter: false, requireAuth: false },
  },
 {
  path: "/logs",
  name: "Logs",
  component: Logs,
  meta: { title: "Logs Page", hideFooter: false, requireAuth: false },
},
 {
  path: "/rules",
  name: "Rules",
  component: Rules,
  meta: { title: "Rules Page", hideFooter: false, requireAuth: false },
},
 {
  path: "/model",
  name: "Model",
  component: Model,
  meta: { title: "Model Page", hideFooter: false, requireAuth: false },
},

//#endregion
  
];

const router = createRouter(
  {
  history: createWebHistory(),
  routes,
});



export function goBack() {
  if (!router.options.history.state.back) {
    router.push("/home");
    return;
  }

  router.go(-1);
}

export default router;
