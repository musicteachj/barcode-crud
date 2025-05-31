<template>
  <v-app-bar color="primary" density="compact" elevation="0">
    <v-app-bar-nav-icon>
      <v-icon :icon="routeIcon" />
    </v-app-bar-nav-icon>

    <v-app-bar-title>
      {{ routeName }}
    </v-app-bar-title>

    <v-spacer />

    <v-app-bar-title> Barcode Gen </v-app-bar-title>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

// Composables
const route = useRoute();

// Route icon mapping
const routeIconMap: Record<string, string> = {
  Scan: "mdi-barcode-scan",
  Create: "mdi-barcode",
  Print: "mdi-printer",
};

// Computed properties
const routeIcon = computed(() => {
  return routeIconMap[route.name as string] || "mdi-barcode";
});

const routeName = computed(() => {
  return (route.name as string) || "Home";
});
</script>

<style scoped>
/* Vuetify 3 automatically handles text color contrast on colored backgrounds */
</style>
