import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import axios from "axios";
import { RootState } from "./types";
import { barcodes } from "./modules/barcodes";

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
  },
};

export default new Vuex.Store<RootState>(store);
