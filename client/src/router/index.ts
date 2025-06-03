import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Landing",
    component: () =>
      import(/* webpackChunkName: "landing" */ "../views/Landing.vue"),
    meta: {
      title: "Welcome - Barcode Gen",
      showNavigation: false,
    },
  },
  {
    path: "/create",
    name: "Create",
    component: () =>
      import(/* webpackChunkName: "create" */ "../views/Create.vue"),
    meta: {
      title: "Create Barcode",
      showNavigation: true,
    },
  },
  {
    path: "/scan",
    name: "Scan",
    component: () => import(/* webpackChunkName: "scan" */ "../views/Scan.vue"),
    meta: {
      title: "Scan Barcode",
      showNavigation: true,
    },
  },
  {
    path: "/print",
    name: "Print",
    component: () =>
      import(/* webpackChunkName: "print" */ "../views/Print.vue"),
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
