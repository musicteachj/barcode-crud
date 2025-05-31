<template>
  <v-app>
    <template v-if="!appReady">
      <!-- Splash Screen -->
      <v-container
        fluid
        class="splash-container d-flex align-center justify-center"
      >
        <v-card flat width="100%" max-width="900" class="transparent">
          <!-- Title Section -->
          <v-card-text class="text-center">
            <Transition name="app-head">
              <h1 v-if="show" :class="titleClass">Barcode Gen</h1>
            </Transition>
            <Transition name="app-head">
              <p v-if="show" :class="subtitleClass">
                Scan, Create and Print Barcodes
              </p>
            </Transition>
          </v-card-text>

          <!-- Barcode Animation -->
          <v-card-text class="text-center py-8">
            <Transition name="anim-bar">
              <!-- <VueBarcode
                v-if="showBar"
                class="mx-auto"
                value="example"
                :font-size="20"
              >
                Please enter a valid value for this barcode type.
              </VueBarcode> -->
              <p>Barcode</p>
            </Transition>
          </v-card-text>

          <!-- Action Button -->
          <v-card-text class="text-center">
            <Transition name="app-head">
              <v-btn
                v-if="showBtn"
                @click="startApp"
                color="primary"
                size="large"
                class="mx-auto"
              >
                Let's Go
              </v-btn>
            </Transition>
          </v-card-text>
        </v-card>
      </v-container>
    </template>

    <template v-else>
      <!-- Main App -->
      <TopToolbar class="top-toolbar" />
      <v-main>
        <router-view />
      </v-main>
      <BottomNav class="bottom-nav" />
    </template>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useDisplay } from "vuetify";
import TopToolbar from "@/components/TopToolbar.vue";
import BottomNav from "@/components/BottomNav.vue";
// import VueBarcode from "vue-barcode";

// Composables
const display = useDisplay();

// State
const appReady = ref(false);
const show = ref(false);
const showBar = ref(false);
const showBtn = ref(false);
const windowSize = ref({
  width: window.innerWidth,
  height: window.innerHeight,
});

// Computed Properties
const titleClass = computed(() => {
  const baseClasses = "font-weight-regular";

  switch (display.name.value) {
    case "xs":
      return `${baseClasses} text-h4`;
    case "sm":
      return `${baseClasses} text-h3`;
    case "md":
      return `${baseClasses} text-h2`;
    case "lg":
    case "xl":
      return `${baseClasses} text-h1`;
    default:
      return `${baseClasses} text-h1`;
  }
});

const subtitleClass = computed(() => {
  const baseClasses = "font-weight-regular";

  switch (display.name.value) {
    case "xs":
      return `${baseClasses} text-h5`;
    case "sm":
    case "md":
      return `${baseClasses} text-h4`;
    case "lg":
    case "xl":
      return `${baseClasses} text-h3`;
    default:
      return `${baseClasses} text-h4`;
  }
});

// Methods
const handleResize = () => {
  windowSize.value = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

const startApp = () => {
  // Trigger leave animations
  show.value = false;
  showBar.value = false;
  showBtn.value = false;

  // Wait for animations to complete, then show main app
  setTimeout(() => {
    appReady.value = true;
  }, 500);
};

// Lifecycle
onMounted(() => {
  window.addEventListener("resize", handleResize);

  // Start entrance animations
  show.value = true;

  // Stagger the animations
  setTimeout(() => {
    showBar.value = true;
  }, 1000);

  setTimeout(() => {
    showBtn.value = true;
  }, 1500);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.splash-container {
  min-height: 100vh;
}

.top-toolbar {
  position: sticky;
  top: 0;
  z-index: 10;
}

.bottom-nav {
  position: sticky;
  bottom: 0;
}

/* Animations */
.app-head-enter-active {
  transition: all 1s ease;
}

.app-head-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.app-head-enter-from,
.app-head-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.anim-bar-enter-active,
.anim-bar-leave-active {
  transition: transform 0.5s ease, opacity 0.5s ease;
}

.anim-bar-enter-from {
  transform: translateX(-500px) rotateZ(360deg);
  opacity: 0;
}

.anim-bar-leave-to {
  transform: translateX(500px) rotateZ(-360deg);
  opacity: 0;
}
</style>
