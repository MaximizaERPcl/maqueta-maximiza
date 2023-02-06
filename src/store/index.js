import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    rutaActual: "",
    snackbar: {
      mostrar: false,
      mensaje: "",
      color: "success",
      icon: "",
    },
    drawer: true,
    dialogoMora: false,
  },
  getters: {
    drawer: (state) => {
      return state.drawer;
    },
  },
  mutations: {
    cambiarRuta(state, ruta) {
      state.rutaActual = ruta;
    },
    SET_SNACKBAR(state, payload) {
      state.snackbar = payload;
    },
    CLOSE_SNACKBAR(state) {
      state.snackbar.mostrar = false;
    },
    SET_DRAWER(state, value) {
      state.drawer = value;
    },
    SET_DIALOGO_MORA(state, value) {
      state.dialogoMora = value;
    },
  },
  actions: {
    mostrarAlerta({ commit }, payload) {
      if (payload.color === "success") {
        payload.icon = "mdi-check-circle-outline";
      } else if (payload.color === "warning") {
        payload.icon = "mdi-alert-outline";
      } else if (payload.color === "error") {
        payload.icon = "mdi-alert-octagon-outline";
      } else if (payload.color === "info") {
        payload.icon = "alert-circle-outline";
      }

      commit("SET_SNACKBAR", {
        mostrar: payload.mostrar,
        color: payload.color,
        mensaje: payload.mensaje,
        icon: payload.icon,
      });
    },
    cerrarAlerta({ commit }) {
      commit("CLOSE_SNACKBAR");
    },

    switchDrawer({ commit }, value) {
      commit("SET_DRAWER", value);
    },
    mostrarDialogoMora({ commit }, value) {
      commit("SET_DIALOGO_MORA", value);
    },
  },
  modules: {},
});
