<template>
  <v-snackbar
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :timeout="timeout"
    color="success"
    location="top"
    class="text-center"
  >
    <span class="text-body-1">{{ message }}</span>

    <template #actions>
      <v-btn variant="text" @click="$emit('update:modelValue', false)">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Props
interface Props {
  modelValue: boolean;
  isDelete?: boolean;
  customMessage?: string;
  timeout?: number;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  isDelete: false,
  timeout: 7000,
});

// Emits
defineEmits<{
  "update:modelValue": [value: boolean];
}>();

// Constants
const DEFAULT_CREATE_MESSAGE = "Barcode Added To Print Page";
const DEFAULT_DELETE_MESSAGE = "Barcode Deleted";

// Computed
const message = computed(() => {
  if (props.customMessage) {
    return props.customMessage;
  }
  return props.isDelete ? DEFAULT_DELETE_MESSAGE : DEFAULT_CREATE_MESSAGE;
});
</script>
