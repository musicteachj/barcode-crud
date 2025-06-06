<template>
  <v-container class="create-container">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <!-- Header -->
        <transition name="fade-in" appear>
          <v-card flat class="mb-6 text-center">
            <v-card-title class="justify-center">
              <h1 class="text-h4 text-md-h3 font-weight-bold primary--text">
                Create Barcode
              </h1>
            </v-card-title>
            <v-card-subtitle class="text-subtitle-1">
              Generate professional barcodes in seconds
            </v-card-subtitle>
          </v-card>
        </transition>

        <!-- Limit Alert -->
        <v-expand-transition>
          <v-alert
            v-if="excededBarcodeLimit"
            type="warning"
            prominent
            outlined
            class="mb-6"
          >
            <v-row align="center">
              <v-col class="grow">
                <div class="text-h6">Barcode Limit Reached</div>
                <div>
                  You've reached the maximum of 20 barcodes. Please delete some
                  before creating new ones.
                </div>
              </v-col>
              <v-col class="shrink">
                <v-btn color="warning" outlined @click="$router.push('/print')">
                  Go to Print Page
                </v-btn>
              </v-col>
            </v-row>
          </v-alert>
        </v-expand-transition>

        <!-- Form Card -->
        <transition name="slide-up" appear>
          <v-card
            v-if="!excededBarcodeLimit"
            elevation="4"
            class="pa-6 pa-md-8"
          >
            <v-form ref="form" @submit.prevent="handleSubmit">
              <!-- Barcode Name -->
              <v-text-field
                v-model="formData.name"
                label="Barcode Name"
                placeholder="e.g., Product SKU"
                outlined
                prepend-inner-icon="mdi-tag"
                counter="13"
                maxlength="13"
                :error-messages="nameErrors"
                @blur="$v.formData.name.$touch()"
                @input="$v.formData.name.$touch()"
                class="mb-4"
              />

              <!-- Barcode Type -->
              <v-select
                v-model="formData.type"
                :items="barcodeTypes"
                label="Barcode Type"
                outlined
                prepend-inner-icon="mdi-barcode"
                item-text="text"
                item-value="value"
                :error-messages="typeErrors"
                @blur="$v.formData.type.$touch()"
                @change="onTypeChange"
                class="mb-4"
              >
                <template v-slot:item="{ item }">
                  <v-list-item-content>
                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ item.description }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-select>

              <!-- Barcode Value -->
              <v-text-field
                v-if="selectedType"
                v-model="formData.value"
                :label="
                  selectedType.numOnly ? 'Numeric Value' : 'Barcode Value'
                "
                :placeholder="valuePlaceholder"
                outlined
                prepend-inner-icon="mdi-numeric"
                :counter="selectedType.value.max"
                :maxlength="selectedType.value.max"
                :error-messages="valueErrors"
                :hint="valueHint"
                :persistent-hint="true"
                @blur="$v.formData.value.$touch()"
                @input="onValueInput"
                :mask="selectedType.mask"
                class="mb-6"
              />

              <!-- Preview Section -->
              <v-expand-transition>
                <div v-if="showPreview">
                  <v-divider class="mb-6" />

                  <v-card
                    flat
                    color="grey lighten-5"
                    class="preview-card pa-6 mb-6"
                  >
                    <v-card-subtitle class="text-center pb-2">
                      Preview
                    </v-card-subtitle>

                    <v-card-text class="text-center">
                      <div class="barcode-wrapper">
                        <VueBarcode
                          v-if="isValidBarcode"
                          :value="barcodeValue"
                          :options="barcodeOptions"
                          ref="barcodePreview"
                        />
                        <div v-else class="py-8">
                          <v-icon large color="grey lighten-1">
                            mdi-barcode-off
                          </v-icon>
                          <p class="text-body-2 grey--text mt-2">
                            Invalid barcode value
                          </p>
                        </div>
                      </div>
                    </v-card-text>

                    <v-card-actions
                      v-if="isValidBarcode"
                      class="justify-center"
                    >
                      <v-chip small color="success" outlined>
                        <v-icon left small>mdi-check</v-icon>
                        Valid {{ selectedType.text }} Barcode
                      </v-chip>
                    </v-card-actions>
                  </v-card>
                </div>
              </v-expand-transition>

              <!-- Form Actions -->
              <v-row class="mt-6">
                <v-col cols="12" sm="6">
                  <v-btn
                    block
                    large
                    outlined
                    color="grey"
                    @click="resetForm"
                    :disabled="isFormEmpty"
                  >
                    <v-icon left>mdi-refresh</v-icon>
                    Reset
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-btn
                    block
                    large
                    color="primary"
                    type="submit"
                    :loading="loading"
                    :disabled="$v.$invalid || !isValidBarcode"
                  >
                    <v-icon left>mdi-content-save</v-icon>
                    Save Barcode
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </transition>

        <!-- Success Snackbar -->
        <v-snackbar
          v-model="snackbar"
          :timeout="4000"
          color="success"
          bottom
          right
        >
          <v-icon left>mdi-check-circle</v-icon>
          Barcode saved successfully!
          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
          </template>
        </v-snackbar>

        <!-- Error Alert -->
        <v-snackbar
          v-model="errorSnackbar"
          :timeout="5000"
          color="error"
          bottom
          right
        >
          <v-icon left>mdi-alert-circle</v-icon>
          {{ errorMessage }}
          <template v-slot:action="{ attrs }">
            <v-btn text v-bind="attrs" @click="errorSnackbar = false">
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  numeric,
} from "vuelidate/lib/validators";
import VueBarcode from "vue-barcode";
import { v4 as uuidv4 } from "uuid";
import { mask } from "vue-the-mask";
import { Barcode } from "@/store/types";
import {
  BarcodeType,
  BARCODE_TYPES,
  getDefaultBarcodeOptions,
} from "@/constants/barcodeTypes";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cdigit = require("cdigit");
const barcodesModule = namespace("barcodes");

// Interfaces
interface FormData {
  name: string;
  type: string;
  value: string;
}

// Custom Validators
const validBarcodeValue =
  (selectedType: BarcodeType | null) =>
  (value: string): boolean => {
    if (!value || !selectedType) return false;

    // Length validation
    if (
      value.length < selectedType.limits.min ||
      value.length > selectedType.limits.max
    ) {
      return false;
    }

    // Type-specific validation
    if (selectedType.numOnly && !/^\d+$/.test(value)) {
      return false;
    }

    // Integer constraints validation
    if (
      selectedType.intConstraints?.minValue !== null &&
      selectedType.intConstraints?.minValue !== undefined
    ) {
      const numValue = parseInt(value, 10);
      if (
        numValue < selectedType.intConstraints.minValue ||
        numValue > (selectedType.intConstraints.maxValue || Infinity)
      ) {
        return false;
      }
    }

    return true;
  };

@Component({
  components: {
    VueBarcode,
  },
  mixins: [validationMixin],
  directives: {
    mask,
  },
  validations: {
    formData: {
      name: {
        required,
        minLength: minLength(1),
        maxLength: maxLength(13),
      },
      type: {
        required,
      },
      value: {
        required,
        validBarcodeValue(value: string) {
          const component = this as any;
          const selectedType = component.selectedType;
          return validBarcodeValue(selectedType)(value);
        },
      },
    },
  },
})
export default class Create extends Vue {
  @barcodesModule.State("barcodes") barcodes!: Barcode[];
  @barcodesModule.Action("createBarcode") createBarcode!: (
    data: any
  ) => Promise<void>;
  @barcodesModule.Action("fetchBarcodes") fetchBarcodes!: () => Promise<void>;

  // Form data
  formData: FormData = {
    name: "",
    type: "",
    value: "",
  };

  // UI State
  loading = false;
  snackbar = false;
  errorSnackbar = false;
  errorMessage = "";

  // Barcode Types Configuration
  barcodeTypes: BarcodeType[] = BARCODE_TYPES;

  // Computed Properties
  get selectedType(): BarcodeType | null {
    return (
      this.barcodeTypes.find((t) => t.value === this.formData.type) || null
    );
  }

  get excededBarcodeLimit(): boolean {
    return this.barcodes.length >= 20;
  }

  get isFormEmpty(): boolean {
    return !this.formData.name && !this.formData.type && !this.formData.value;
  }

  get showPreview(): boolean {
    return !!this.formData.type && !!this.formData.value;
  }

  get barcodeValue(): string {
    if (!this.selectedType || !this.formData.value) return "";

    // Add check digit if required
    if (this.selectedType.checkDigit) {
      try {
        return cdigit.gtin.generate(this.formData.value);
      } catch (e) {
        return this.formData.value;
      }
    }

    return this.formData.value;
  }

  get isValidBarcode(): boolean {
    if (!this.selectedType || !this.formData.value) return false;

    // Check basic validation
    const isValid = validBarcodeValue(this.selectedType)(this.formData.value);

    // Additional check for barcode component validity
    if (isValid && this.$refs.barcodePreview) {
      const barcodeComponent = this.$refs.barcodePreview as any;
      return barcodeComponent.valid !== false;
    }

    return isValid;
  }

  get barcodeOptions() {
    return getDefaultBarcodeOptions(this.selectedType?.type);
  }

  get valueHint(): string {
    if (!this.selectedType) return "";

    const { min, max } = this.selectedType.limits;

    if (min === max) {
      return `Must be exactly ${min} ${
        this.selectedType.numOnly ? "digits" : "characters"
      }`;
    }

    if (this.selectedType.intConstraints?.minValue) {
      return `Value between ${this.selectedType.intConstraints.minValue} and ${this.selectedType.intConstraints.maxValue}`;
    }

    return `Between ${min} and ${max} ${
      this.selectedType.numOnly ? "digits" : "characters"
    }`;
  }

  get valuePlaceholder(): string {
    if (!this.selectedType) return "";

    if (this.selectedType.numOnly) {
      return "0".repeat(this.selectedType.limits.min);
    }

    return "Enter barcode value";
  }

  // Validation Error Messages
  get nameErrors(): string[] {
    const errors: string[] = [];
    if (!this.$v.formData?.name?.$dirty) return errors;

    !this.$v.formData.name.required && errors.push("Name is required");
    !this.$v.formData.name.minLength &&
      errors.push("Name must be at least 1 character");
    !this.$v.formData.name.maxLength &&
      errors.push("Name must be at most 13 characters");

    return errors;
  }

  get typeErrors(): string[] {
    const errors: string[] = [];
    if (!this.$v.formData?.type?.$dirty) return errors;

    !this.$v.formData.type.required &&
      errors.push("Please select a barcode type");

    return errors;
  }

  get valueErrors(): string[] {
    const errors: string[] = [];
    if (!this.$v.formData?.value?.$dirty) return errors;

    !this.$v.formData.value.required && errors.push("Value is required");

    if (this.selectedType && this.formData.value && this.$v.formData?.value) {
      !this.$v.formData.value.validBarcodeValue &&
        errors.push(this.getValueErrorMessage());
    }

    return errors;
  }

  // Lifecycle
  created() {
    // this.fetchBarcodes();
  }

  // Methods

  getValueErrorMessage(): string {
    if (!this.selectedType) return "Invalid value";

    const { min, max } = this.selectedType.limits;

    if (this.selectedType.numOnly && !/^\d+$/.test(this.formData.value)) {
      return "Only numeric values are allowed";
    }

    if (min === max) {
      return `Value must be exactly ${min} ${
        this.selectedType.numOnly ? "digits" : "characters"
      }`;
    }

    return `Value must be between ${min} and ${max} ${
      this.selectedType.numOnly ? "digits" : "characters"
    }`;
  }

  onTypeChange() {
    // Clear value when type changes
    this.formData.value = "";
    if (this.$v.formData?.value) {
      this.$v.formData.value.$reset();
    }

    // Update mask for the selected type
    if (this.selectedType) {
      this.selectedType.mask = this.selectedType.numOnly
        ? "#".repeat(this.selectedType.limits.max)
        : "X".repeat(this.selectedType.limits.max);
    }
  }

  onValueInput() {
    // Validate on input for better UX
    if (this.$v.formData?.value) {
      this.$v.formData.value.$touch();
    }
  }

  resetForm() {
    this.formData = {
      name: "",
      type: "",
      value: "",
    };
    this.$v.$reset();
  }

  async handleSubmit() {
    this.$v.$touch();

    if (this.$v.$invalid || !this.isValidBarcode) {
      return;
    }

    this.loading = true;

    try {
      const barcode = {
        uuid: uuidv4(),
        name: this.formData.name,
        type: this.selectedType!.type,
        value: this.barcodeValue,
      };

      await this.createBarcode({ ...barcode });

      this.snackbar = true;
      this.resetForm();

      // Navigate to print page after short delay
      setTimeout(() => {
        if (this.barcodes.length === 1) {
          this.$router.push("/print");
        }
      }, 1500);
    } catch (error) {
      this.errorMessage = "Failed to save barcode. Please try again.";
      this.errorSnackbar = true;
    } finally {
      this.loading = false;
    }
  }

  // Watchers
  @Watch("formData.name")
  onNameChange(newVal: string) {
    if (!newVal && this.isFormEmpty) {
      this.resetForm();
    }
  }
}
</script>

<style lang="scss" scoped>
.create-container {
  min-height: calc(100vh - 112px); // Account for top toolbar and bottom nav
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.preview-card {
  border: 2px dashed rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.barcode-wrapper {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

// Animations
.fade-in-enter-active {
  transition: opacity 0.5s ease;
}

.fade-in-enter {
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-up-enter {
  transform: translateY(30px);
  opacity: 0;
}

// Responsive adjustments
@media (max-width: 600px) {
  .create-container {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  .v-card {
    padding: 1rem !important;
  }
}
</style>
