import Vue from 'vue'
import VueRouter from 'vue-router'
import Inicio from '../views/Inicio.vue'
import auth from '../auth/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/maximiza',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    meta:{
      requiresAuth:false
    }
  },
  {
    path: '/maximiza/ingresa',
    name: 'ingresa',
    component: Inicio,
    meta:{
      requiresAuth:true
    }
  },
  {
    path: '/maximiza/simulador-creditos',
    name: 'creditos',
    component: () => import(/* webpackChunkName: "about" */ '../views/SimuladorCredito.vue'),
    meta:{
      requiresAuth:true
    }
  },
  {
    path: '/maximiza/simulador-dap',
    name: 'dap',
    component: () => import(/* webpackChunkName: "about" */ '../views/SimuladorDap.vue'),
    meta:{
      requiresAuth:true
    }
  },
  {
    path: '/maximiza/productos/:product',
    name: 'productos',
    component: () => import(/* webpackChunkName: "about" */ '../views/Productos.vue'),
    meta:{
      requiresAuth:true
    }
  },
  {
    path: '/',
    redirect: '/maximiza/'
  },
  {
    path: '*',
    redirect: '/maximiza/'
  },

  //{ path: "/", component: HomeComponent },
  // ... otras rutas ...
  //{ path: "*", component: Inicio }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (auth.isAuthenticated()) {
      next()
      return
    } else {
      next('/maximiza/')
    }
  } else {
    if (auth.isAuthenticated()) {
      next('/maximiza/ingresa')
      return
    } else {
      next()
    }
  }
})

export default router
