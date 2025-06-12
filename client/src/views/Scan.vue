<template>
  <div class="scan-page">
    <!-- Main Container -->
    <v-container v-if="!isScanning" class="scan-container">
      <!-- Header -->
      <v-row justify="center" class="mb-6">
        <v-col cols="12" class="text-center">
          <transition name="fade-in" appear>
            <div>
              <h1
                class="text-h4 text-md-h3 font-weight-bold primary--text mb-2"
              >
                Scan Barcode
              </h1>
              <p class="text-subtitle-1 grey--text">
                {{
                  cameraDetected
                    ? "Use your camera to scan barcodes instantly"
                    : "Camera access required for scanning"
                }}
              </p>
            </div>
          </transition>
        </v-col>
      </v-row>

      <!-- Camera Available -->
      <template v-if="cameraDetected">
        <!-- Limit Warning -->
        <v-row v-if="exceededBarcodeLimit" justify="center" class="mb-6">
          <v-col cols="12" md="8" lg="6">
            <v-alert type="warning" prominent outlined>
              <v-row align="center">
                <v-col class="grow">
                  <div class="text-h6">Barcode Limit Reached</div>
                  <div>
                    You've reached the maximum of 20 barcodes. Delete some
                    before scanning new ones.
                  </div>
                </v-col>
                <v-col class="shrink">
                  <v-btn
                    color="warning"
                    outlined
                    @click="$router.push('/print')"
                  >
                    Manage Barcodes
                  </v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </v-col>
        </v-row>

        <!-- Scan Button -->
        <v-row v-if="!scannedBarcode && !exceededBarcodeLimit" justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <transition name="scale-in" appear>
              <v-card elevation="8" class="scan-card pa-8 text-center">
                <v-icon size="80" color="primary" class="mb-4">
                  mdi-qrcode-scan
                </v-icon>

                <h2 class="text-h5 mb-4">Ready to Scan</h2>

                <p class="text-body-1 grey--text mb-6">
                  Position the barcode within the camera frame. The scanner will
                  automatically detect it.
                </p>

                <v-btn
                  x-large
                  color="primary"
                  rounded
                  elevation="4"
                  @click="startScan"
                  :loading="loading"
                >
                  <v-icon left>mdi-camera</v-icon>
                  Start Scanning
                </v-btn>

                <v-divider class="my-6" />

                <div class="text-caption grey--text">
                  <v-icon small>mdi-information-outline</v-icon>
                  Supports EAN-13, EAN-8, UPC, and more
                </div>
              </v-card>
            </transition>
          </v-col>
        </v-row>

        <!-- Scanned Result -->
        <v-row
          v-if="
            scannedBarcode && scannedBarcode.codeResult && !exceededBarcodeLimit
          "
          justify="center"
        >
          <v-col cols="12" md="8" lg="6">
            <transition name="slide-up" appear>
              <v-card elevation="4" class="pa-6">
                <v-card-title class="text-h5 justify-center">
                  Barcode Detected!
                </v-card-title>

                <v-card-text>
                  <!-- Barcode Preview -->
                  <div class="barcode-preview my-6">
                    <VueBarcode
                      :value="scannedBarcode.codeResult.code || ''"
                      :options="barcodeOptions"
                      class="mx-auto d-block"
                    />
                  </div>

                  <!-- Barcode Info -->
                  <v-alert color="primary" outlined class="mb-4">
                    <div class="d-flex align-center">
                      <div>
                        <div class="text-subtitle-2">Scanned Value</div>
                        <div class="text-h6 font-weight-bold">
                          {{ scannedBarcode.codeResult.code || "Unknown" }}
                        </div>
                      </div>
                      <v-spacer />
                      <v-chip color="primary" outlined>
                        {{
                          formatBarcodeType(
                            scannedBarcode.codeResult.format || ""
                          )
                        }}
                      </v-chip>
                    </div>
                  </v-alert>

                  <!-- Name Input -->
                  <v-form ref="scanForm" v-model="valid">
                    <v-text-field
                      v-model="scanBarName"
                      label="Barcode Name"
                      placeholder="Enter a name for this barcode"
                      outlined
                      prepend-inner-icon="mdi-tag"
                      :rules="nameRules"
                      counter="13"
                      maxlength="13"
                      autofocus
                    />
                  </v-form>
                </v-card-text>

                <v-card-actions class="pa-4">
                  <v-btn large text @click="reset">
                    <v-icon left>mdi-refresh</v-icon>
                    Scan Another
                  </v-btn>
                  <v-spacer />
                  <v-btn
                    large
                    color="primary"
                    :disabled="!valid"
                    :loading="saveLoading"
                    @click="saveScan"
                  >
                    <v-icon left>mdi-content-save</v-icon>
                    Save Barcode
                  </v-btn>
                </v-card-actions>
              </v-card>
            </transition>
          </v-col>
        </v-row>
      </template>

      <!-- No Camera -->
      <template v-else>
        <v-row justify="center">
          <v-col cols="12" sm="8" md="6" class="text-center">
            <transition name="fade-in" appear>
              <v-card flat>
                <v-icon size="120" color="grey lighten-2">
                  mdi-camera-off
                </v-icon>
                <h2 class="text-h5 font-weight-light grey--text mt-4">
                  Camera Not Available
                </h2>
                <p class="text-body-1 grey--text mt-2 mb-4">
                  This device doesn't have a camera or camera access was denied.
                </p>
                <v-btn color="primary" outlined @click="checkCameraAgain">
                  <v-icon left>mdi-refresh</v-icon>
                  Check Again
                </v-btn>
              </v-card>
            </transition>
          </v-col>
        </v-row>
      </template>
    </v-container>

    <!-- Scanning View (Fullscreen on mobile) -->
    <div
      v-show="isScanning"
      class="scanner-container"
      :class="{ 'scanner-fullscreen': isMobile }"
    >
      <div id="interactive" class="viewport">
        <video />
        <canvas class="drawingBuffer" />

        <!-- Scanner Overlay -->
        <div class="scanner-overlay">
          <!-- Top Bar -->
          <div class="scanner-header">
            <v-btn icon dark @click="stopScan" class="ml-2">
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-spacer />
            <span class="white--text text-h6">Scanning...</span>
            <v-spacer />
            <div style="width: 48px" />
          </div>

          <!-- Scanning Frame -->
          <div class="scanner-frame">
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
          </div>

          <!-- Bottom Instructions -->
          <div class="scanner-footer">
            <p class="white--text text-center mb-4">
              Position barcode within the frame
            </p>
            <v-btn large color="error" rounded @click="stopScan">
              <v-icon left>mdi-stop</v-icon>
              Stop Scanning
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :timeout="4000"
      :color="snackbarColor"
      bottom
      right
    >
      <v-icon left>{{ snackbarIcon }}</v-icon>
      {{ snackbarMessage }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import Quagga, { QuaggaResultObject } from "quagga";
import VueBarcode from "vue-barcode";
import { getDefaultBarcodeOptions } from "@/constants/barcodeTypes";

const barcodesModule = namespace("barcodes");

@Component({
  components: {
    VueBarcode,
  },
})
export default class Scan extends Vue {
  @barcodesModule.State("barcodes") barcodes!: any[];
  @barcodesModule.Action("createBarcode") createBarcode!: (
    data: any
  ) => Promise<void>;

  // Camera state
  cameraDetected = false;
  isScanning = false;
  loading = false;
  saveLoading = false;

  // Form state
  valid = false;
  scanBarName = "";
  scannedBarcode: QuaggaResultObject | null = null;

  // UI state
  snackbar = false;
  snackbarMessage = "";
  snackbarColor = "success";
  snackbarIcon = "mdi-check-circle";

  // Window dimensions
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  // Validation rules
  nameRules = [
    (v: string) => !!v || "Name is required",
    (v: string) =>
      (v && v.length >= 1 && v.length <= 13) ||
      "Name must be between 1 and 13 characters",
  ];

  // Computed properties
  get exceededBarcodeLimit(): boolean {
    return this.barcodes.length >= 20;
  }

  get isMobile(): boolean {
    return this.windowWidth <= 600;
  }

  get barcodeOptions() {
    const format = this.scannedBarcode?.codeResult?.format || "CODE128";
    return {
      ...getDefaultBarcodeOptions(this.formatBarcodeType(format)),
      width: 2,
      height: 80,
    };
  }

  // Lifecycle
  created() {
    this.checkUserCamera();
    window.addEventListener("resize", this.handleResize);
  }

  destroyed() {
    window.removeEventListener("resize", this.handleResize);
    if (this.isScanning) {
      this.stopScan();
    }
  }

  // Methods
  handleResize() {
    this.windowWidth = window.innerWidth;
    this.windowHeight = window.innerHeight;
  }

  async checkUserCamera() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.cameraDetected = devices.some(
        (device) => device.kind === "videoinput"
      );
    } catch (error) {
      console.error("Error checking camera:", error);
      this.cameraDetected = false;
    }
  }

  checkCameraAgain() {
    this.checkUserCamera();
  }

  startScan() {
    this.loading = true;
    this.isScanning = true;
    this.scannedBarcode = null;

    // Initialize Quagga
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: document.querySelector("#interactive"),
          constraints: {
            width: { min: 640 },
            height: { min: 480 },
            facingMode: "environment",
            aspectRatio: { min: 1, max: 2 },
          },
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: navigator.hardwareConcurrency || 2,
        frequency: 10,
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader",
            "code_128_reader",
            "code_39_reader",
            "upc_reader",
            "upc_e_reader",
          ],
        },
        locate: true,
      },
      (err) => {
        this.loading = false;

        if (err) {
          console.error("Quagga init error:", err);
          this.showSnackbar(
            "Failed to start camera",
            "error",
            "mdi-alert-circle"
          );
          this.isScanning = false;
          return;
        }

        Quagga.start();
      }
    );

    // Set up event handlers
    Quagga.onDetected(this.onDetected);
    Quagga.onProcessed(this.onProcessed);
  }

  stopScan() {
    Quagga.stop();
    this.isScanning = false;
  }

  onDetected(result: QuaggaResultObject) {
    // Check if we have valid code result
    if (!result.codeResult?.code || !result.codeResult?.format) {
      return;
    }

    // Stop scanning and show result
    this.stopScan();
    this.scannedBarcode = result;

    // Play a subtle sound/vibration if available
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }
  }

  onProcessed(result: any) {
    const drawingCtx = Quagga.canvas.ctx.overlay;
    const drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
      if (result.boxes) {
        drawingCtx.clearRect(
          0,
          0,
          parseInt(drawingCanvas.getAttribute("width") || "0"),
          parseInt(drawingCanvas.getAttribute("height") || "0")
        );

        result.boxes
          .filter((box: any) => box !== result.box)
          .forEach((box: any) => {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
              color: "green",
              lineWidth: 2,
            });
          });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
          color: "#00F",
          lineWidth: 2,
        });
      }

      if (result.codeResult && result.codeResult.code) {
        Quagga.ImageDebug.drawPath(
          result.line,
          { x: "x", y: "y" },
          drawingCtx,
          {
            color: "red",
            lineWidth: 3,
          }
        );
      }
    }
  }

  formatBarcodeType(format: string): string {
    const typeMap: Record<string, string> = {
      ean_13: "EAN13",
      ean_8: "EAN8",
      upc_a: "UPC",
      upc_e: "UPCE",
      code_128: "CODE128",
      code_39: "CODE39",
    };
    return typeMap[format] || format.toUpperCase();
  }

  reset() {
    this.scanBarName = "";
    this.scannedBarcode = null;
    this.valid = false;
    if (this.$refs.scanForm) {
      (this.$refs.scanForm as any).reset();
    }
  }

  async saveScan() {
    if (
      !this.scannedBarcode?.codeResult?.code ||
      !this.scannedBarcode?.codeResult?.format ||
      !this.valid
    ) {
      return;
    }

    this.saveLoading = true;

    try {
      const barcode = {
        name: this.scanBarName,
        type: this.formatBarcodeType(this.scannedBarcode.codeResult.format),
        value: this.scannedBarcode.codeResult.code,
        createdAt: new Date(),
      };

      await this.createBarcode(barcode);

      this.showSnackbar(
        "Barcode saved successfully!",
        "success",
        "mdi-check-circle"
      );
      this.reset();

      // Navigate to print page after delay if this was the first barcode
      if (this.barcodes.length === 1) {
        setTimeout(() => {
          this.$router.push("/print");
        }, 1500);
      }
    } catch (error) {
      this.showSnackbar("Failed to save barcode", "error", "mdi-alert-circle");
    } finally {
      this.saveLoading = false;
    }
  }

  showSnackbar(message: string, color: string, icon: string) {
    this.snackbarMessage = message;
    this.snackbarColor = color;
    this.snackbarIcon = icon;
    this.snackbar = true;
  }

  // Watchers
  @Watch("windowWidth")
  onWindowResize() {
    if (this.isScanning && !this.isMobile) {
      // Restart scanning if switching from mobile to desktop while scanning
      this.stopScan();
      setTimeout(() => this.startScan(), 100);
    }
  }
}
</script>

<style lang="scss" scoped>
.scan-page {
  min-height: calc(100vh - 112px);
}

.scan-container {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.scan-card {
  border: 2px dashed rgba(var(--v-primary-base), 0.3);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--v-primary-base);
    transform: translateY(-2px);
  }
}

.barcode-preview {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
}

// Scanner styles
.scanner-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: #000;
  z-index: 9999;

  &.scanner-fullscreen {
    .scanner-header {
      padding-top: env(safe-area-inset-top);
    }
  }
}

.viewport {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.viewport canvas,
.viewport video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.scanner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  pointer-events: none;

  > * {
    pointer-events: auto;
  }
}

.scanner-header {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
  padding: 1rem;
  display: flex;
  align-items: center;
}

.scanner-footer {
  margin-top: auto;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

// Scanning frame
.scanner-frame {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 200px;
  pointer-events: none;

  .corner {
    position: absolute;
    width: 40px;
    height: 40px;
    border: 3px solid #fff;

    &.top-left {
      top: 0;
      left: 0;
      border-right: none;
      border-bottom: none;
    }

    &.top-right {
      top: 0;
      right: 0;
      border-left: none;
      border-bottom: none;
    }

    &.bottom-left {
      bottom: 0;
      left: 0;
      border-right: none;
      border-top: none;
    }

    &.bottom-right {
      bottom: 0;
      right: 0;
      border-left: none;
      border-top: none;
    }
  }
}

// Animations
.fade-in-enter-active {
  transition: opacity 0.5s ease;
}

.fade-in-enter {
  opacity: 0;
}

.scale-in-enter-active {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.scale-in-enter {
  transform: scale(0.9);
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.5s ease;
}

.slide-up-enter {
  transform: translateY(30px);
  opacity: 0;
}

// Mobile optimizations
@media (max-width: 600px) {
  .scan-container {
    padding: 1rem;
  }

  .scanner-frame {
    width: 240px;
    height: 160px;
  }
}
</style>
