import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { RootState } from "./types";

// Modules
import { barcodes } from "./modules/barcodes";
import { snackbar } from "./modules/snackbar";

Vue.use(Vuex);

const store: StoreOptions<RootState> = {
  state: {
    appName: "Barcode Gen",
    version: "2.0.0",
  },
  mutations: {},
  actions: {},
  getters: {
    appTitle: (state) => state.appName,
  },
  modules: {
    barcodes,
    snackbar,
  },
};

export default new Vuex.Store<RootState>(store);
