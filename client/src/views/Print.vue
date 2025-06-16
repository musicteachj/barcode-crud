<template>
  <v-container class="print-container">
    <!-- Header -->
    <v-row justify="center" class="mb-6">
      <v-col cols="12" class="text-center">
        <transition name="fade-in" appear>
          <div>
            <h1 class="text-h4 text-md-h3 font-weight-bold primary--text mb-2">
              Print Barcodes
            </h1>
            <p class="text-subtitle-1 grey--text">
              Manage and print your saved barcodes
            </p>
          </div>
        </transition>
      </v-col>
    </v-row>

    <!-- Stats Bar -->
    <transition name="slide-down" appear>
      <v-row justify="center" class="mb-6" v-if="barcodes.length > 0">
        <v-col cols="12" md="10" lg="8">
          <v-card elevation="2" class="pa-4">
            <v-row align="center">
              <v-col cols="6" sm="3">
                <div class="text-center">
                  <v-icon large color="primary">mdi-barcode</v-icon>
                  <div class="text-h5 font-weight-bold">
                    {{ barcodes.length }}
                  </div>
                  <div class="text-caption">Total Barcodes</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="text-center">
                  <v-icon large color="success">mdi-shape</v-icon>
                  <div class="text-h5 font-weight-bold">{{ uniqueTypes }}</div>
                  <div class="text-caption">Barcode Types</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="text-center">
                  <v-icon large color="warning">mdi-alert-circle</v-icon>
                  <div class="text-h5 font-weight-bold">
                    {{ 20 - barcodes.length }}
                  </div>
                  <div class="text-caption">Remaining Slots</div>
                </div>
              </v-col>
              <v-col cols="6" sm="3">
                <div class="text-center">
                  <v-btn
                    color="primary"
                    rounded
                    @click="printAllBarcodes"
                    :disabled="barcodes.length === 0"
                  >
                    <v-icon left>mdi-printer</v-icon>
                    Print All
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </transition>

    <!-- Barcodes Grid -->
    <v-row v-if="barcodes.length > 0" justify="center">
      <v-col cols="12" md="10" lg="8">
        <transition-group
          name="barcode-list"
          tag="div"
          class="barcode-grid"
          appear
        >
          <v-card
            v-for="(barcode, index) in barcodes"
            :key="barcode._id"
            :data-index="index"
            elevation="3"
            class="barcode-card"
            :class="{ 'barcode-card-hover': hoveredCard === barcode._id }"
            @mouseenter="hoveredCard = barcode._id || ''"
            @mouseleave="hoveredCard = null"
          >
            <!-- Card Header -->
            <v-card-title class="pb-2">
              <v-row align="center" no-gutters>
                <v-col>
                  <div class="text-h6 font-weight-bold text-truncate">
                    {{ barcode.name }}
                  </div>
                  <div class="text-caption grey--text">
                    {{ getBarcodeTypeInfo(barcode.type)?.text || barcode.type }}
                  </div>
                </v-col>
                <v-col cols="auto">
                  <v-chip small outlined :color="getTypeColor(barcode.type)">
                    {{ barcode.type }}
                  </v-chip>
                </v-col>
              </v-row>
            </v-card-title>

            <v-divider />

            <!-- Barcode Display -->
            <v-card-text class="text-center py-4">
              <div class="barcode-wrapper">
                <VueBarcode
                  :id="`barcode-${barcode._id}`"
                  :value="barcode.value"
                  :options="getBarcodeOptions(barcode.type)"
                  class="barcode-display"
                />

                <!-- Hidden barcode for printing -->
                <VueBarcode
                  :id="`print-${index}`"
                  :value="barcode.value"
                  :options="getPrintBarcodeOptions(barcode.type)"
                  class="hidden-print"
                />
              </div>

              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div
                    v-bind="attrs"
                    v-on="on"
                    class="text-body-2 mt-2 font-weight-medium"
                  >
                    {{ barcode.value }}
                  </div>
                </template>
                <span>Barcode Value</span>
              </v-tooltip>
            </v-card-text>

            <!-- Card Actions -->
            <v-card-actions class="pa-3">
              <v-btn text small color="error" @click="confirmDelete(barcode)">
                <v-icon left small>mdi-delete</v-icon>
                Delete
              </v-btn>

              <v-spacer />

              <v-btn
                text
                small
                color="primary"
                @click="printSingleBarcode(index)"
              >
                <v-icon left small>mdi-printer</v-icon>
                Print
              </v-btn>
            </v-card-actions>
          </v-card>
        </transition-group>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else justify="center" class="empty-state">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <transition name="fade-in" appear>
          <div>
            <v-icon size="120" color="grey lighten-2"> mdi-barcode-off </v-icon>
            <h2 class="text-h5 font-weight-light grey--text mt-4">
              No Barcodes Yet
            </h2>
            <p class="text-body-1 grey--text mt-2">
              Start by creating your first barcode
            </p>
            <v-btn
              color="primary"
              rounded
              class="mt-4"
              @click="$router.push('/create')"
            >
              <v-icon left>mdi-plus</v-icon>
              Create Barcode
            </v-btn>
          </div>
        </transition>
      </v-col>
    </v-row>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">
          <v-icon left color="error">mdi-alert</v-icon>
          Delete Barcode
        </v-card-title>

        <v-card-text v-if="barcodeToDelete">
          Are you sure you want to delete the barcode "{{
            barcodeToDelete.name
          }}"? This action cannot be undone.
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="deleteDialog = false"> Cancel </v-btn>
          <v-btn
            color="error"
            text
            @click="deleteBarcode"
            :loading="deleteLoading"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import VueBarcode from "vue-barcode";
import { Printd } from "printd";
import { Barcode } from "@/store/types";
import {
  BarcodeType,
  getBarcodeType,
  getDefaultBarcodeOptions,
} from "@/constants/barcodeTypes";

const barcodesModule = namespace("barcodes");
const snackbarModule = namespace("snackbar");

@Component({
  components: {
    VueBarcode,
  },
})
export default class Print extends Vue {
  // Barcodes Vuex State
  @barcodesModule.State("barcodes") barcodes!: Barcode[];
  @barcodesModule.State("loading") loading!: boolean;
  @barcodesModule.Action("fetchBarcodes") fetchBarcodes!: () => Promise<void>;
  @barcodesModule.Action("deleteBarcode") deleteBarcodeAction!: (
    barcode: Barcode
  ) => Promise<void>;

  // Snackbar Vuex State
  @snackbarModule.Action("showSuccess")
  showSuccess!: (message: string) => void;
  @snackbarModule.Action("showError")
  showError!: (message: string) => void;
  @snackbarModule.Action("showInfo")
  showInfo!: (message: string) => void;

  // UI State
  deleteDialog = false;
  deleteLoading = false;
  barcodeToDelete: Barcode | null = null;
  hoveredCard: string | null = null;

  // Print styles
  printStyles = `
    @page {
      size: auto;
      margin: 20mm;
    }
    
    body {
      margin: 0;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    
    .barcode-print-container {
      text-align: center;
      page-break-inside: avoid;
    }
    
    .barcode-name {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .barcode-type {
      font-size: 14px;
      color: #666;
      margin-bottom: 20px;
    }
    
    svg {
      max-width: 100%;
      height: auto;
    }
  `;

  // Computed Properties
  get uniqueTypes(): number {
    const types = new Set(this.barcodes.map((b) => b.type));
    return types.size;
  }

  // Lifecycle
  created() {
    // this.fetchBarcodes();
  }

  // Methods
  getBarcodeTypeInfo(type: string): BarcodeType | undefined {
    return getBarcodeType(type);
  }

  getBarcodeOptions(type: string) {
    return {
      ...getDefaultBarcodeOptions(type),
      height: 80,
      fontSize: 14,
    };
  }

  getPrintBarcodeOptions(type: string) {
    return {
      ...getDefaultBarcodeOptions(type),
      width: 2,
      height: 100,
      fontSize: 20,
    };
  }

  getTypeColor(type: string): string {
    const typeColors: Record<string, string> = {
      CODE128: "primary",
      EAN13: "success",
      EAN8: "success",
      UPC: "info",
      CODE39: "warning",
      ITF14: "orange",
      MSI: "purple",
      pharmacode: "pink",
    };
    return typeColors[type] || "grey";
  }

  confirmDelete(barcode: Barcode) {
    this.barcodeToDelete = barcode;
    this.deleteDialog = true;
  }

  async deleteBarcode() {
    if (!this.barcodeToDelete) return;

    this.deleteLoading = true;

    try {
      await this.deleteBarcodeAction(this.barcodeToDelete);
      this.showSuccess("Barcode deleted successfully");
      this.deleteDialog = false;
      this.barcodeToDelete = null;
    } catch (error) {
      this.showError("Failed to delete barcode");
    } finally {
      this.deleteLoading = false;
    }
  }

  printSingleBarcode(index: number) {
    const printd = new Printd();
    const element = document.getElementById(`print-${index}`);

    if (element) {
      const barcode = this.barcodes[index];
      const wrapper = document.createElement("div");
      wrapper.className = "barcode-print-container";
      wrapper.innerHTML = `
        <div class="barcode-name">${barcode.name}</div>
        <div class="barcode-type">${barcode.type}</div>
        ${element.outerHTML}
      `;

      printd.print(wrapper, [this.printStyles]);
      this.showInfo("Opening print dialog...");
    }
  }

  printAllBarcodes() {
    const printd = new Printd();
    const wrapper = document.createElement("div");

    this.barcodes.forEach((barcode, index) => {
      const element = document.getElementById(`print-${index}`);
      if (element) {
        const barcodeContainer = document.createElement("div");
        barcodeContainer.className = "barcode-print-container";
        barcodeContainer.style.marginBottom = "40px";
        barcodeContainer.innerHTML = `
          <div class="barcode-name">${barcode.name}</div>
          <div class="barcode-type">${barcode.type}</div>
          ${element.outerHTML}
        `;
        wrapper.appendChild(barcodeContainer);
      }
    });

    printd.print(wrapper, [this.printStyles]);
    this.showInfo("Opening print dialog for all barcodes...");
  }
}
</script>

<style lang="scss" scoped>
.print-container {
  min-height: calc(100vh - 112px);
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.barcode-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.barcode-card {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 2px solid transparent;
  overflow: hidden;

  &-hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    border-color: var(--v-primary-base);
  }
}

.barcode-wrapper {
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.barcode-display {
  max-width: 100%;
  height: auto;
}

.hidden-print {
  display: none;
}

.empty-state {
  min-height: 400px;
  align-items: center;
}

// Animations
.fade-in-enter-active {
  transition: opacity 0.5s ease;
}

.fade-in-enter {
  opacity: 0;
}

.slide-down-enter-active {
  transition: all 0.5s ease;
}

.slide-down-enter {
  transform: translateY(-20px);
  opacity: 0;
}

.barcode-list-enter-active,
.barcode-list-leave-active {
  transition: all 0.5s ease;
}

.barcode-list-enter {
  opacity: 0;
  transform: translateY(30px);
}

.barcode-list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.barcode-list-move {
  transition: transform 0.5s ease;
}

// Stagger animation on load
.barcode-list-enter-active {
  transition-delay: calc(0.1s * var(--index));
}

.barcode-card {
  --index: 0;
}

@for $i from 0 through 20 {
  .barcode-card[data-index="#{$i}"] {
    --index: #{$i};
  }
}

// Responsive
@media (max-width: 600px) {
  .barcode-grid {
    grid-template-columns: 1fr;
  }

  .print-container {
    padding: 1rem;
  }
}
</style>
