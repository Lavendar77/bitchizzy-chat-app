import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import auth from "./auth";
import asset from "./asset";

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    asset
  }
})
