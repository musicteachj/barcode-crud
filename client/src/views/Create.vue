<template>
  <v-container>
    <!-- Page Title -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-h3 text-center font-weight-light my-4">
          Create Barcodes
        </h1>
      </v-col>
    </v-row>

    <!-- Limit Exceeded Message -->
    <v-row v-if="excededBarcodeLimit" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-alert type="warning" variant="tonal" class="mb-8">
          <v-alert-title>Barcode Limit Reached</v-alert-title>
          You've reached the maximum of 20 barcodes. Please delete some from the
          Print page before creating new ones.
        </v-alert>
      </v-col>
    </v-row>

    <!-- Barcode Form -->
    <v-row v-else justify="center">
      <v-col cols="12" sm="10" md="8" lg="6" xl="5">
        <v-form @submit.prevent="handleSubmit">
          <!-- Name Field -->
          <v-text-field
            v-model="form.name"
            label="Barcode Name"
            prepend-icon="mdi-tag"
            :error-messages="getErrorMessages('name')"
            @blur="v$.name.$touch()"
            counter="13"
            clearable
          />

          <!-- Type Selection -->
          <v-select
            v-model="form.type"
            :items="barcodeTypes"
            label="Barcode Type"
            prepend-icon="mdi-barcode"
            item-title="text"
            item-value="type"
            return-object
            :error-messages="getErrorMessages('type')"
            @blur="v$.type.$touch()"
            @update:model-value="onTypeChange"
          />

          <!-- Value Field -->
          <v-text-field
            v-if="form.type"
            v-model="form.value"
            :label="valueFieldLabel"
            prepend-icon="mdi-card-text"
            :error-messages="getErrorMessages('value')"
            @blur="v$.value.$touch()"
            :counter="form.type?.value.max"
            :hint="hintText"
            persistent-hint
            clearable
          />

          <!-- Barcode Preview -->
          <v-row v-if="form.type" class="my-8">
            <v-col cols="12">
              <v-card variant="outlined" class="pa-4">
                <div class="text-center" style="min-height: 120px">
                  <!-- <VueBarcode
                    v-if="canDisplayBarcode"
                    :value="barcodeValue"
                    :format="form.type.type"
                    :width="getBarcodeWidth()"
                    :font-size="20"
                    :display-value="true"
                  /> -->
                  <p v-if="canDisplayBarcode">Barcode</p>
                  <p v-else class="text-body-2 text-medium-emphasis">
                    Enter a valid value to preview barcode
                  </p>
                </div>
              </v-card>
            </v-col>
          </v-row>

          <!-- Action Buttons -->
          <v-row>
            <v-col cols="12" class="text-center">
              <v-btn
                color="error"
                variant="outlined"
                class="mr-3"
                :disabled="isFormEmpty"
                @click="resetForm"
              >
                Reset
              </v-btn>
              <v-btn
                color="primary"
                variant="elevated"
                type="submit"
                :disabled="!canSubmit"
                :loading="isSaving"
              >
                Save Barcode
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

    <!-- Success Snackbar -->
    <SnackBar v-model="showSnackbar" />
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import {
  required,
  minLength,
  maxLength,
  numeric,
  between,
} from "@vuelidate/validators";
import { v4 as uuidv4 } from "uuid";
import VueBarcode from "vue-barcode";
import { useBarcodeStore } from "@/stores/index";
import SnackBar from "@/components/SnackBar.vue";
import { barcodeTypes, type BarcodeType } from "@/constants/barcodeTypes";

// Store
const barcodeStore = useBarcodeStore();

// Form State
const form = ref({
  name: "",
  type: null as BarcodeType | null,
  value: "",
});

// UI State
const showSnackbar = ref(false);
const isSaving = ref(false);

// Computed Properties
const excededBarcodeLimit = computed(() => barcodeStore.barcodes.length >= 20);

const valueFieldLabel = computed(() => {
  if (!form.value.type) return "Barcode Value";
  return form.value.type.numOnly ? "Numeric Value" : "Barcode Value";
});

const hintText = computed(() => {
  const type = form.value.type;
  if (!type) return "";

  if (type.value.min === type.value.max) {
    return `Must be exactly ${type.value.min} ${
      type.numOnly ? "digits" : "characters"
    }`;
  }

  let hint = `Must be ${type.value.min}-${type.value.max} ${
    type.numOnly ? "digits" : "characters"
  }`;

  if (type.intConstraints?.minValue !== null) {
    hint += ` (value between ${type.intConstraints.minValue}-${type.intConstraints.maxValue})`;
  }

  return hint;
});

const canDisplayBarcode = computed(() => {
  return (
    form.value.value &&
    form.value.value.length >= (form.value.type?.value.min || 0)
  );
});

const barcodeValue = computed(() => {
  if (!form.value.type || !form.value.value) return "";

  // Add check digit if needed
  if (
    form.value.type.checkDigit &&
    form.value.value.length === form.value.type.value.max
  ) {
    // For demo purposes - in production, use proper check digit calculation
    return form.value.value;
  }

  return form.value.value;
});

const isFormEmpty = computed(() => {
  return !form.value.name && !form.value.type && !form.value.value;
});

const canSubmit = computed(() => {
  return !v$.value.$invalid && !isSaving.value;
});

// Validation Rules
const rules = computed(() => {
  const baseRules: any = {
    name: {
      required,
      minLength: minLength(1),
      maxLength: maxLength(13),
    },
    type: {
      required,
    },
  };

  if (form.value.type) {
    const valueRules: any = {
      required,
      minLength: minLength(form.value.type.value.min),
      maxLength: maxLength(form.value.type.value.max),
    };

    if (form.value.type.numOnly) {
      valueRules.numeric = numeric;
    }

    if (form.value.type.intConstraints?.minValue !== null) {
      valueRules.between = between(
        form.value.type.intConstraints.minValue,
        form.value.type.intConstraints.maxValue
      );
    }

    baseRules.value = valueRules;
  }

  return baseRules;
});

// Vuelidate instance
const v$ = useVuelidate(rules, form);

// Methods
const getErrorMessages = (field: string) => {
  const errors: string[] = [];
  const fieldErrors = v$.value[field];

  if (!fieldErrors || !fieldErrors.$error) return errors;

  if (fieldErrors.required && fieldErrors.required.$invalid) {
    errors.push(
      `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
    );
  }
  if (fieldErrors.minLength && fieldErrors.minLength.$invalid) {
    errors.push(`Minimum length is ${fieldErrors.minLength.$params.min}`);
  }
  if (fieldErrors.maxLength && fieldErrors.maxLength.$invalid) {
    errors.push(`Maximum length is ${fieldErrors.maxLength.$params.max}`);
  }
  if (fieldErrors.numeric && fieldErrors.numeric.$invalid) {
    errors.push("Must contain only numbers");
  }
  if (fieldErrors.between && fieldErrors.between.$invalid) {
    errors.push(
      `Value must be between ${fieldErrors.between.$params.min} and ${fieldErrors.between.$params.max}`
    );
  }

  return errors;
};

const getBarcodeWidth = () => {
  // Adjust width based on barcode type
  const type = form.value.type?.type;
  if (type === "EAN2" || type === "EAN5") return 1.5;
  if (type === "pharmacode") return 2.5;
  return 2;
};

const onTypeChange = () => {
  // Reset value when type changes
  form.value.value = "";
  v$.value.$reset();
};

const resetForm = () => {
  form.value = {
    name: "",
    type: null,
    value: "",
  };
  v$.value.$reset();
};

const handleSubmit = async () => {
  const isValid = await v$.value.$validate();
  if (!isValid) return;

  isSaving.value = true;

  try {
    const barcode = {
      uuid: uuidv4(),
      name: form.value.name,
      type: form.value.type!.type,
      value: barcodeValue.value,
    };

    await barcodeStore.saveBarcode(barcode);

    showSnackbar.value = true;
    resetForm();
  } catch (error) {
    console.error("Failed to save barcode:", error);
    // Handle error - could show error snackbar
  } finally {
    isSaving.value = false;
  }
};

// Watchers
watch(
  () => form.value.name,
  (newVal) => {
    if (newVal === "") {
      resetForm();
    }
  }
);

// Lifecycle
barcodeStore.retrieveBarcodes();
</script>
