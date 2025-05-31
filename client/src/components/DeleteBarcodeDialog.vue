<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="500"
    persistent
  >
    <v-card>
      <v-card-title class="bg-primary"> Delete Barcode </v-card-title>

      <v-divider />

      <v-card-text class="pt-6">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="barcode.name"
                label="Barcode Name"
                variant="outlined"
                readonly
                density="comfortable"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="barcode.type"
                label="Barcode Type"
                variant="outlined"
                readonly
                density="comfortable"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="barcode.value"
                label="Barcode Value"
                variant="outlined"
                readonly
                density="comfortable"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <p class="text-body-1">
                Are you sure you wish to delete this barcode?
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="closeDialog"> Cancel </v-btn>
        <v-btn
          color="error"
          variant="text"
          :loading="isDeleting"
          @click="handleDelete"
        >
          Delete
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useBarcodeStore } from "@/stores/barcode";
import type { Barcode } from "@/types";

// Props
interface Props {
  modelValue: boolean;
  barcode: Barcode;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  deleted: [];
}>();

// Store
const barcodeStore = useBarcodeStore();

// State
const isDeleting = ref(false);

// Methods
const closeDialog = () => {
  emit("update:modelValue", false);
};

const handleDelete = async () => {
  isDeleting.value = true;

  try {
    await barcodeStore.deleteBarcode(props.barcode);
    emit("deleted");
    closeDialog();
  } catch (error) {
    console.error("Failed to delete barcode:", error);
    // Handle error - you might want to show an error snackbar here
  } finally {
    isDeleting.value = false;
  }
};
</script>

<style scoped>
/* Most styling handled by Vuetify utility classes */
</style>
