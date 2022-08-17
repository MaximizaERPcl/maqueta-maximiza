import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
 
  {
    path: '/maximiza/ingresa',
    name: 'ingresa',
    component: () => import(/* webpackChunkName: "about" */ '../views/Inicio.vue')
  },
  {
    path: '/maximiza/simulador-creditos',
    name: 'creditos',
    component: () => import(/* webpackChunkName: "about" */ '../views/SimuladorCredito.vue')
  },
  {
    path: '/maximiza/simulador-dap',
    name: 'dap',
    component: () => import(/* webpackChunkName: "about" */ '../views/SimuladorDap.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
