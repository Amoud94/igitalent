import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    loadingOverlay:false
  },
  getters: {
    getUser(state) {
      return state.user;
    },
    getLoading(state) {
      return state.loadingOverlay;
    },
  },
  mutations: {
    SET_USER(state, paylaod) {
      state.user = paylaod;
    },
    SET_LOADING(state, paylaod) {
      state.loadingOverlay = paylaod;
    },
  },
  actions: {
    setUser(context, payload) {
      context.commit("SET_USER", payload)
    },
    setLoadingOverlay(context, payload) {
      context.commit("SET_LOADING", payload)
    }
  }
})