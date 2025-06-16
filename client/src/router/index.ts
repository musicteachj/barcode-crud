import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

import Landing from "../views/Landing.vue";
import Create from "../views/Create.vue";
import Scan from "../views/Scan.vue";
import Print from "../views/Print.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Landing",
    component: Landing,
    meta: {
      title: "Welcome - Barcode Gen",
      showNavigation: false,
    },
  },
  {
    path: "/create",
    name: "Create",
    component: Create,
    meta: {
      title: "Create Barcode",
      showNavigation: true,
    },
  },
  {
    path: "/scan",
    name: "Scan",
    component: Scan,
    meta: {
      title: "Scan Barcode",
      showNavigation: true,
    },
  },
  {
    path: "/print",
    name: "Print",
    component: Print,
    meta: {
      title: "Print Barcodes",
      showNavigation: true,
    },
  },
  {
    path: "*",
    redirect: "/",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { x: 0, y: 0 };
    }
  },
});

// Navigation guard to update page titles
router.beforeEach((to, from, next) => {
  document.title = to.meta?.title || "Barcode Gen";
  next();
});

export default router;
