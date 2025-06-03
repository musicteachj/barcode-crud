<template>
  <v-container fluid class="landing-container">
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="10" md="8" lg="6">
        <v-card flat class="transparent text-center">
          <!-- Title Section -->
          <transition name="slide-fade" appear>
            <div v-if="showTitle" class="mb-4">
              <h1
                class="display-2 display-md-1 font-weight-bold primary--text mb-2 mt-8"
              >
                Barcode Gen
              </h1>
              <p class="subtitle-1 subtitle-md-h6 grey--text text--darken-1">
                Scan, Create and Print Barcodes with Ease
              </p>
            </div>
          </transition>

          <!-- Barcode Animation -->
          <transition name="barcode-slide" appear>
            <v-card
              v-if="showBarcode"
              flat
              class="mx-auto my-8 barcode-container"
              max-width="400"
            >
              <VueBarcode
                value="WELCOME2025"
                :options="barcodeOptions"
                class="barcode-element"
              >
                Barcode Generation Example
              </VueBarcode>
            </v-card>
          </transition>

          <!-- Features Grid -->
          <transition name="fade-up" appear>
            <v-row v-if="showFeatures" class="my-8">
              <v-col
                v-for="feature in features"
                :key="feature.icon"
                cols="12"
                sm="4"
              >
                <v-card
                  flat
                  class="pa-4 feature-card"
                  :class="{ 'feature-card-hover': hover === feature.icon }"
                  @mouseenter="hover = feature.icon"
                  @mouseleave="hover = null"
                >
                  <v-icon :color="feature.color" size="48" class="mb-3">
                    {{ feature.icon }}
                  </v-icon>
                  <h3 class="subtitle-1 font-weight-bold mb-2">
                    {{ feature.title }}
                  </h3>
                  <p class="body-2 grey--text text--darken-1">
                    {{ feature.description }}
                  </p>
                </v-card>
              </v-col>
            </v-row>
          </transition>

          <!-- CTA Button -->
          <transition name="bounce-in" appear>
            <div v-if="showButton" class="mt-8">
              <v-btn
                color="primary"
                x-large
                rounded
                elevation="8"
                @click="getStarted"
                class="cta-button"
              >
                <v-icon left>mdi-rocket-launch</v-icon>
                Get Started
              </v-btn>
            </div>
          </transition>

          <!-- Quick Actions -->
          <transition name="fade" appear>
            <v-row v-if="showQuickActions" class="mt-8" justify="center">
              <v-col
                cols="auto"
                v-for="action in quickActions"
                :key="action.route"
              >
                <v-btn
                  text
                  color="primary"
                  @click="$router.push(action.route)"
                  class="quick-action-btn"
                >
                  <v-icon left small>{{ action.icon }}</v-icon>
                  {{ action.text }}
                </v-btn>
              </v-col>
            </v-row>
          </transition>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VueBarcode from "vue-barcode";

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface QuickAction {
  icon: string;
  text: string;
  route: string;
}

@Component({
  components: {
    VueBarcode,
  },
})
export default class Landing extends Vue {
  // Animation states
  showTitle = false;
  showBarcode = false;
  showFeatures = false;
  showButton = false;
  showQuickActions = false;
  hover: string | null = null;

  // Barcode options
  barcodeOptions = {
    format: "CODE128",
    width: 2,
    height: 100,
    displayValue: true,
    fontSize: 20,
    font: "Roboto",
    textMargin: 5,
    background: "#ffffff",
    lineColor: "#000000",
  };

  // Features data
  features: Feature[] = [
    {
      icon: "mdi-qrcode-scan",
      title: "Scan Barcodes",
      description: "Use your device camera to quickly scan and save barcodes",
      color: "primary",
    },
    {
      icon: "mdi-barcode",
      title: "Create Barcodes",
      description: "Generate various barcode formats with custom data",
      color: "success",
    },
    {
      icon: "mdi-printer",
      title: "Print Barcodes",
      description: "Export and print your barcodes in high quality",
      color: "info",
    },
  ];

  // Quick actions
  quickActions: QuickAction[] = [
    { icon: "mdi-plus", text: "Create New", route: "/create" },
    { icon: "mdi-camera", text: "Quick Scan", route: "/scan" },
  ];

  mounted() {
    this.animateElements();
  }

  animateElements() {
    // Stagger animations for smooth appearance
    setTimeout(() => {
      this.showTitle = true;
    }, 100);
    setTimeout(() => {
      this.showBarcode = true;
    }, 400);
    setTimeout(() => {
      this.showFeatures = true;
    }, 700);
    setTimeout(() => {
      this.showButton = true;
    }, 1000);
    setTimeout(() => {
      this.showQuickActions = true;
    }, 1200);
  }

  getStarted() {
    // Add exit animation before navigation
    this.showTitle = false;
    this.showBarcode = false;
    this.showFeatures = false;
    this.showButton = false;
    this.showQuickActions = false;

    setTimeout(() => {
      this.$router.push("/create");
    }, 300);
  }
}
</script>

<style lang="scss" scoped>
.landing-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.barcode-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
}

.barcode-element {
  display: block;
  margin: 0 auto;
}

.feature-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  transition: all 0.3s ease;
  min-height: 200px;

  &-hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
}

.cta-button {
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 0 40px !important;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 35px rgba(33, 150, 243, 0.3);
  }
}

.quick-action-btn {
  opacity: 0.8;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
}

// Animations
.slide-fade-enter-active {
  transition: all 0.5s ease;
}

.slide-fade-enter {
  transform: translateY(-30px);
  opacity: 0;
}

.barcode-slide-enter-active {
  transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.barcode-slide-enter {
  transform: translateX(-100px) rotate(-10deg);
  opacity: 0;
}

.fade-up-enter-active {
  transition: all 0.6s ease;
}

.fade-up-enter {
  transform: translateY(30px);
  opacity: 0;
}

.bounce-in-enter-active {
  animation: bounce-in 0.8s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.fade-enter-active {
  transition: opacity 0.5s ease;
}

.fade-enter {
  opacity: 0;
}

// Responsive adjustments
@media (max-width: 600px) {
  .display-1 {
    font-size: 3rem !important;
  }

  .feature-card {
    min-height: 150px;
  }
}
</style>
