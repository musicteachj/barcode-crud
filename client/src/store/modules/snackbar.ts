/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Module } from "vuex";
import { RootState, SnackbarState, SnackbarOptions } from "../types";

export const snackbar: Module<SnackbarState, RootState> = {
  namespaced: true,

  state: {
    show: false,
    message: "",
    icon: "",
    color: "info",
    timeout: 4000,
    multiLine: false,
    vertical: false,
    top: true,
    bottom: false,
    left: false,
    right: false,
    centered: false,
  },

  mutations: {
    SHOW_SNACKBAR(state, options: SnackbarOptions) {
      state.message = options.message;
      state.icon = options.icon || "";
      state.color = options.color || "info";
      state.timeout = options.timeout || 4000;
      state.multiLine = options.multiLine || false;
      state.vertical = options.vertical || false;
      state.top = options.top !== undefined ? options.top : true;
      state.bottom = options.bottom || false;
      state.left = options.left || false;
      state.right = options.right || false;
      state.centered = options.centered || false;
      state.show = true;
    },

    HIDE_SNACKBAR(state) {
      state.show = false;
    },

    RESET_SNACKBAR(state) {
      state.show = false;
      state.message = "";
      state.icon = "";
      state.color = "info";
      state.timeout = 4000;
      state.multiLine = false;
      state.vertical = false;
      state.top = true;
      state.bottom = false;
      state.left = false;
      state.right = false;
      state.centered = false;
    },
  },

  actions: {
    showSnackbar({ commit }, options: SnackbarOptions) {
      commit("SHOW_SNACKBAR", options);
    },

    hideSnackbar({ commit }) {
      commit("HIDE_SNACKBAR");
    },

    resetSnackbar({ commit }) {
      commit("RESET_SNACKBAR");
    },

    // Convenience actions for different message types
    showSuccess({ commit }, message: string) {
      commit("SHOW_SNACKBAR", {
        message,
        icon: "mdi-check-circle",
        color: "success",
      });
    },

    showError({ commit }, message: string) {
      commit("SHOW_SNACKBAR", {
        message,
        icon: "mdi-alert-circle",
        color: "error",
      });
    },

    showWarning({ commit }, message: string) {
      commit("SHOW_SNACKBAR", {
        message,
        icon: "mdi-alert",
        color: "warning",
      });
    },

    showInfo({ commit }, message: string) {
      commit("SHOW_SNACKBAR", {
        message,
        icon: "mdi-information",
        color: "info",
      });
    },
  },

  getters: {
    isVisible: (state) => state.show,
    message: (state) => state.message,
    icon: (state) => state.icon,
    color: (state) => state.color,
    timeout: (state) => state.timeout,
    options: (state) => ({
      multiLine: state.multiLine,
      vertical: state.vertical,
      top: state.top,
      bottom: state.bottom,
      left: state.left,
      right: state.right,
      centered: state.centered,
    }),
  },
};
