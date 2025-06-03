<template>
  <v-card flat tile>
    <v-toolbar dense color="primary" height="48">
      <!-- Route Icon -->
      <v-btn icon>
        <v-icon size="24" color="white">{{ routeIcon }}</v-icon>
      </v-btn>

      <!-- Route Name -->
      <v-toolbar-title class="white--text ml-n3">
        {{ routeName }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- App Title -->
      <v-toolbar-title class="white--text"> Barcode Gen </v-toolbar-title>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

interface RouteConfig {
  name: string;
  icon: string;
}

@Component
export default class TopToolbar extends Vue {
  // Route configurations with proper typing
  routeConfigs: Record<string, RouteConfig> = {
    Scan: { name: "Scan", icon: "mdi-barcode-scan" },
    Create: { name: "Create", icon: "mdi-barcode" },
    Print: { name: "Print", icon: "mdi-printer" },
    Landing: { name: "Home", icon: "mdi-home" },
  };

  // Computed properties
  get routeIcon(): string {
    const config = this.routeConfigs[this.$route.name || ""];
    return config?.icon || "mdi-barcode";
  }

  get routeName(): string {
    const config = this.routeConfigs[this.$route.name || ""];
    return config?.name || this.$route.name || "Barcode Gen";
  }
}
</script>

<style lang="scss" scoped>
.v-toolbar__title {
  font-size: 1rem;
  font-weight: 500;
}
</style>
