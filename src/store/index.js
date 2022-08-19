import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    rutaActual:'Titulo Pestaña',
  },
  getters: {

  },
  mutations: {
    cambiarRuta (state, ruta){
      state.rutaActual = ruta
    }
  },
  actions: {
  },
  modules: {
  }
})
