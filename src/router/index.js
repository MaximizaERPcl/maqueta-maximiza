import Vue from "vue";
import VueRouter from "vue-router";
import Inicio from "../views/InicioView.vue";
import auth from "../auth/auth";

Vue.use(VueRouter);

const routes = [
  {
    path: "/maximiza_vue",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LoginView.vue"),
    meta: {
      requiresAuth: false,
    },
    children: [
      {
        path: "crear-contrasena/:id_cliente",
        name: "crear_contrasena",
        component: () =>
          import(
            /* webpackChunkName: "about" */ "../components/login/RecuperarClave.vue"
          ),
      },
    ],
  },
  {
    path: "/maximiza_vue/ingresa",
    name: "ingresa",
    component: Inicio,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/maximiza_vue/simulador-creditos",
    name: "creditos",
    component: () =>
      import(
        /* webpackChunkName: "about" */ "../views/SimuladorCreditoView.vue"
      ),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/maximiza_vue/simulador-dap",
    name: "dap",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SimuladorDapView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/maximiza_vue/productos/:product",
    name: "productos",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ProductosView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/maximiza_vue/cuenta/:ajuste",
    name: "cuenta",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CuentaView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/maximiza_vue/pago-web",
    name: "pagoweb",
    component: () => import("../views/PagoView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/",
    redirect: "/maximiza_vue",
  },
  {
    path: "*",
    redirect: "/maximiza_vue",
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (auth.isAuthenticated()) {
      next();
      return;
    } else {
      next("/maximiza_vue");
    }
  } else {
    if (auth.isAuthenticated()) {
      next("/maximiza_vue/ingresa");
      return;
    } else {
      next();
    }
  }
});

export default router;
