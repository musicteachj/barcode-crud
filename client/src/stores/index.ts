import { defineStore } from "pinia";
import { ref, computed } from "vue";
import axios from "axios";
import type { Barcode } from "@/types";

export const useBarcodeStore = defineStore("barcode", () => {
  // State
  const barcodes = ref<Barcode[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function retrieveBarcodes() {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.get<Barcode[]>("/api/barcodes");
      barcodes.value = response.data;
    } catch (err) {
      error.value = "Failed to retrieve barcodes";
      console.error("Error retrieving barcodes:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function saveBarcode(barcode: Omit<Barcode, "uuid">) {
    loading.value = true;
    error.value = null;

    try {
      await axios.post("/api/barcodes", { barcode });
      // Refresh the list after saving
      await retrieveBarcodes();
    } catch (err) {
      error.value = "Failed to save barcode";
      console.error("Error saving barcode:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteBarcode(barcode: Barcode) {
    loading.value = true;
    error.value = null;

    try {
      await axios.delete(`/api/barcodes/${barcode.uuid}`);
      // Refresh the list after deleting
      await retrieveBarcodes();
    } catch (err) {
      error.value = "Failed to delete barcode";
      console.error("Error deleting barcode:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  // Getters (computed properties)
  const getBarcodeById = (uuid: string) => {
    return barcodes.value.find((barcode) => barcode.uuid === uuid);
  };

  const totalBarcodes = computed(() => barcodes.value.length);

  return {
    // State
    barcodes,
    loading,
    error,

    // Actions
    retrieveBarcodes,
    saveBarcode,
    deleteBarcode,

    // Getters
    getBarcodeById,
    totalBarcodes,
  };
});
