<template>
  <v-bottom-navigation v-model="activeRoute" color="primary" grow height="56">
    <v-btn
      v-for="item in navItems"
      :key="item.value"
      :value="item.value"
      :to="item.to"
    >
      <span>{{ item.label }}</span>
      <v-icon :icon="item.icon" />
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

// Types
interface NavItem {
  value: string;
  label: string;
  icon: string;
  to: { name?: string; path?: string };
}

// Composables
const route = useRoute();

// Navigation items configuration
const navItems: NavItem[] = [
  {
    value: "scan",
    label: "Scan",
    icon: "mdi-barcode-scan",
    to: { name: "Scan" },
  },
  {
    value: "create",
    label: "Create",
    icon: "mdi-barcode",
    to: { name: "Create" },
  },
  {
    value: "print",
    label: "Print",
    icon: "mdi-printer",
    to: { name: "Print" },
  },
];

// Computed properties
const activeRoute = computed(() => {
  // Map route name to nav item value
  const routeMap: Record<string, string> = {
    Scan: "scan",
    Create: "create",
    Print: "print",
  };

  return routeMap[route.name as string] || "create";
});
</script>

<style scoped>
/* Vuetify 3 automatically handles active/inactive styling */
</style>
