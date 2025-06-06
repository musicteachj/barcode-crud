<template>
  <v-bottom-navigation
    v-model="activeRoute"
    app
    grow
    color="#fff"
    background-color="#fff"
    height="56"
  >
    <v-btn
      v-for="item in navigationItems"
      :key="item.value"
      :value="item.value"
      :to="item.to"
    >
      <span :style="getTextStyle(item.routeName)">
        {{ item.title }}
      </span>
      <v-icon size="24" :color="getIconColor(item.routeName)">
        {{ item.icon }}
      </v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";

interface NavigationItem {
  value: string;
  title: string;
  icon: string;
  routeName: string;
  to: { name?: string; path?: string };
}

@Component
export default class BottomNav extends Vue {
  activeRoute = "";

  navigationItems: NavigationItem[] = [
    {
      value: "scan",
      title: "Scan",
      icon: "mdi-barcode-scan",
      routeName: "Scan",
      to: { name: "Scan" },
    },
    {
      value: "create",
      title: "Create",
      icon: "mdi-barcode",
      routeName: "Create",
      to: { path: "/create" },
    },
    {
      value: "print",
      title: "Print",
      icon: "mdi-printer",
      routeName: "Print",
      to: { name: "Print" },
    },
  ];

  mounted(): void {
    this.updateActiveRoute();
  }

  @Watch("$route")
  onRouteChange(): void {
    this.updateActiveRoute();
  }

  updateActiveRoute(): void {
    const currentItem = this.navigationItems.find(
      (item) => item.routeName === this.$route.name
    );
    this.activeRoute = currentItem?.value || "";
  }

  getTextStyle(routeName: string): { color: string } | null {
    return this.$route.name !== routeName ? { color: "primary" } : null;
  }

  getIconColor(routeName: string): string {
    return this.$route.name !== routeName ? "primary" : "#fff";
  }
}
</script>

<style lang="scss" scoped>
.v-item-group.v-bottom-navigation {
  box-shadow: none;
}
</style>
