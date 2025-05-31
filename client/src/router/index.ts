import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Create",
    component: () => import("@/views/Create.vue"),
    meta: {
      title: "Create Barcode",
    },
  },
  {
    path: "/scan",
    name: "Scan",
    component: () => import("@/views/Scan.vue"),
    meta: {
      title: "Scan Barcode",
    },
  },
  {
    path: "/print",
    name: "Print",
    component: () => import("@/views/Print.vue"),
    meta: {
      title: "Print Barcodes",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Optional: Add navigation guards
router.beforeEach((to, _from, next) => {
  // Update document title
  document.title = to.meta.title
    ? `${to.meta.title} - Barcode Gen`
    : "Barcode Gen";
  next();
});

export default router;
