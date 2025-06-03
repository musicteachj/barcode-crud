/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Module } from "vuex";
import axios, { AxiosError } from "axios";
import { RootState, BarcodeState, Barcode, BarcodeFormData } from "../types";

export const barcodes: Module<BarcodeState, RootState> = {
  namespaced: true,

  state: {
    barcodes: [],
    loading: false,
    error: null,
    currentBarcode: null,
  },

  mutations: {
    SET_BARCODES(state, barcodes: Barcode[]) {
      state.barcodes = barcodes;
    },

    ADD_BARCODE(state, barcode: Barcode) {
      state.barcodes.unshift(barcode);
    },

    UPDATE_BARCODE(state, updatedBarcode: Barcode) {
      const index = state.barcodes.findIndex(
        (b) => b.uuid === updatedBarcode.uuid
      );
      if (index !== -1) {
        state.barcodes.splice(index, 1, updatedBarcode);
      }
    },

    REMOVE_BARCODE(state, uuid: string) {
      state.barcodes = state.barcodes.filter((b) => b.uuid !== uuid);
    },

    SET_LOADING(state, loading: boolean) {
      state.loading = loading;
    },

    SET_ERROR(state, error: string | null) {
      state.error = error;
    },

    SET_CURRENT_BARCODE(state, barcode: Barcode | null) {
      state.currentBarcode = barcode;
    },

    CLEAR_ERROR(state) {
      state.error = null;
    },
  },

  actions: {
    async fetchBarcodes({ commit }) {
      commit("SET_LOADING", true);
      commit("CLEAR_ERROR");

      try {
        const response = await axios.get("/api/barcodes");
        commit("SET_BARCODES", response.data);
      } catch (error) {
        const axiosError = error as AxiosError;
        commit("SET_ERROR", axiosError.message || "Failed to fetch barcodes");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async createBarcode({ commit, dispatch }, barcodeData: BarcodeFormData) {
      commit("SET_LOADING", true);
      commit("CLEAR_ERROR");

      try {
        const response = await axios.post("/api/barcodes", {
          barcode: barcodeData,
        });

        // Refresh the list to ensure sync with server
        await dispatch("fetchBarcodes");

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        commit("SET_ERROR", axiosError.message || "Failed to create barcode");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async deleteBarcode({ commit, dispatch }, barcode: Barcode) {
      commit("SET_LOADING", true);
      commit("CLEAR_ERROR");

      try {
        await axios.delete(`/api/barcodes/${barcode.uuid}`);

        // Optimistically remove from state
        commit("REMOVE_BARCODE", barcode.uuid);

        // Refresh to ensure sync
        await dispatch("fetchBarcodes");
      } catch (error) {
        const axiosError = error as AxiosError;
        commit("SET_ERROR", axiosError.message || "Failed to delete barcode");

        // Re-fetch on error to restore state
        await dispatch("fetchBarcodes");
        throw error;
      } finally {
        commit("SET_LOADING", false);
      }
    },

    async scanBarcode({ commit }, scannedValue: string) {
      // This action can be used to process scanned barcodes
      // You might want to check if it exists, create it, etc.
      commit("CLEAR_ERROR");

      try {
        // Check if barcode exists
        const response = await axios.get(`/api/barcodes/check/${scannedValue}`);

        if (response.data.exists) {
          commit("SET_CURRENT_BARCODE", response.data.barcode);
          return { exists: true, barcode: response.data.barcode };
        }

        return { exists: false, value: scannedValue };
      } catch (error) {
        const axiosError = error as AxiosError;
        commit(
          "SET_ERROR",
          axiosError.message || "Failed to process scanned barcode"
        );
        throw error;
      }
    },

    clearError({ commit }) {
      commit("CLEAR_ERROR");
    },

    setCurrentBarcode({ commit }, barcode: Barcode | null) {
      commit("SET_CURRENT_BARCODE", barcode);
    },
  },

  getters: {
    allBarcodes: (state) => state.barcodes,

    barcodeCount: (state) => state.barcodes.length,

    getBarcodeById: (state) => (uuid: string) => {
      return state.barcodes.find((b) => b.uuid === uuid);
    },

    getBarcodesByType: (state) => (type: string) => {
      return state.barcodes.filter((b) => b.type === type);
    },

    recentBarcodes:
      (state) =>
      (limit: number = 5) => {
        return [...state.barcodes]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, limit);
      },

    isLoading: (state) => state.loading,

    hasError: (state) => state.error !== null,

    errorMessage: (state) => state.error,
  },
};
