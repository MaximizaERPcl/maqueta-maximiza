import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
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
