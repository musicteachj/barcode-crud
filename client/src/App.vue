<template>
  <v-app>
    <TopToolbar v-if="showNavigation" class="top-toolbar" />
    <v-main>
      <transition name="fade" mode="out-in">
        <router-view :key="$route.fullPath" />
      </transition>
    </v-main>
    <BottomNav v-if="showNavigation" class="bottom-nav" />

    <!-- Global Snackbar -->
    <GlobalSnackbar />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TopToolbar from "@/components/navigation/TopToolbar.vue";
import BottomNav from "@/components/navigation/BottomNav.vue";
import GlobalSnackbar from "@/components/GlobalSnackbar.vue";

@Component({
  components: {
    TopToolbar,
    BottomNav,
    GlobalSnackbar,
  },
})
export default class App extends Vue {
  get showNavigation(): boolean {
    return this.$route.meta?.showNavigation || false;
  }
}
</script>

<style lang="scss">
// Global styles
#app {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.top-toolbar {
  position: sticky !important;
  top: 0;
  z-index: 10;
}

.bottom-nav {
  position: sticky !important;
  bottom: 0;
  z-index: 10;
}

// Page transition
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

// Custom scrollbar
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
