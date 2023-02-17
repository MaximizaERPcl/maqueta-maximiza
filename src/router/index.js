import Vue from "vue";
import VueRouter from "vue-router";
import Inicio from "../views/InicioView.vue";
import auth from "../auth/auth";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
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
    path: "/inicio",
    name: "ingresa",
    component: Inicio,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/simulador-creditos/:preSelect?",
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
    path: "/simulador-dap",
    name: "dap",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/SimuladorDapView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/productos/:product",
    name: "productos",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/ProductosView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/cuenta/:ajuste",
    name: "cuenta",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/CuentaView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/pago-web",
    name: "pagoweb",
    component: () => import("../views/PagoView.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/",
    redirect: "/inicio",
  },
  {
    path: "*",
    redirect: "/inicio",
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  //Lógica que se ejecuta antes de renderizar la ruta a la vista respectiva
  //Primero se debe validar si la ruta requiere autenticación
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    //Si la ruta requiere autenticación se valida si el usuario está autenticado
    if (auth.isAuthenticated()) {
      //Si el usuario está autenticado se valida si el usuario debe cambiar su clave
      let cambio_clave = auth.getUserLogged().b_cambiar_clave;
      if (parseInt(cambio_clave)) {
        if (to.path === "/cuenta/cambiar-clave") next();
        else next("/cuenta/cambiar-clave");
        return;
      }
      //Si el usuario no debe cambiar su clave se realizan otras validaciones según la ruta a la que desee acceder y sus precondiciones
      else {
        //Si la ruta es de pago web se valida si se está accediendo directamente o es retorno de transbank para determinar que mostrar
        if (to.name === "pagoweb") {
          if (to.query.token_ws) {
            localStorage.setItem("pay_token", to.query.token_ws);
            localStorage.setItem("pay_type", "TBK");
            next({
              path: "/pago-web",
              replace: true,
            });
            return;
          } else if (to.query.TBK_ID_SESION && to.query.TBK_ORDEN_COMPRA) {
            let cancel_pay = {
              TBK_ID_SESION: to.query.TBK_ID_SESION,
              TBK_ORDEN_COMPRA: to.query.TBK_ORDEN_COMPRA,
            };
            if (to.query.TBK_TOKEN) cancel_pay.TBK_TOKEN = to.query.TBK_TOKEN;

            localStorage.setItem("cancel_pay", JSON.stringify(cancel_pay));
            next({
              path: "/pago-web",
              replace: true,
            });
            return;
          } else if (to.query.token_fl && to.query.type) {
            localStorage.setItem("pay_token", to.query.token_fl);
            localStorage.setItem("pay_type", to.query.type);
            localStorage.setItem("id_pago", to.query.id_pago);
            next({
              path: "/pago-web",
              replace: true,
            });
            return;
          }
          next();
          return;
        }
        //Si la ruta es de simulador de créditos se valida si el usuario tiene créditos por firmar
        /*else if (to.name === "seguimiento") {
          if (auth.getUserLogged().b_creditos_firmar === "1") {
            if (to.query.firma === "ok") {
              localStorage.setItem("firma", "1");
              next({
                path: "/seguimiento-credito",
                replace: true,
              });
            } else {
              next();
              return;
            }
          } else {
            next("/inicio");
            return;
          }
        }*/
        //Si la ruta no tiene que validar condiciones especiales se redirige a la ruta solicitada
        else {
          next();
          return;
        }
      }
    }
    //Si el usuario no está autenticado se redirige a la ruta de login
    else {
      next("/login");
    }
  }
  //Si la ruta no requiere autenticación se valida si el usuario está autenticado para redirigirlo a la ruta de inicio
  else {
    if (auth.isAuthenticated()) {
      next("/ingresa");
      return;
    } else {
      next();
    }
  }
});

export default router;
