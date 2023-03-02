<template>
  <v-app
    :style="{
      height: '100%',
      'background-image': 'url(' + require('@/assets/app/background.jpg') + ')',
      'background-position': 'center',
      'background-attachment': 'fixed',
      'background-size': 'cover',
    }"
  >
    <v-snackbar
      :timeout="5000"
      v-model="snackbar.mostrar"
      app
      centered
      top
      elevation="10"
      light
      style="z-index: 99 !important; padding: 0 !important"
    >
      <!--v-row align="center" justify="space-around">
        <v-col cols="1">
          <v-icon left>{{snackbar.icon}}</v-icon>
        </v-col>
        <v-col cols="10">
          <h6 class="alerta">
            {{snackbar.mensaje}} 
          </h6>
        </v-col>
        
      </v-row-->
      <v-alert border="top" :type="snackbar.color" text prominent class="mb-0">
        {{ snackbar.mensaje }}
        <template v-slot:append>
          <v-btn icon class="ml-2" @click="cerrarAlerta()">
            <v-icon :color="snackbar.color">mdi-close-circle-outline</v-icon>
          </v-btn>
        </template>
      </v-alert>
    </v-snackbar>
    <app-side-bar
      v-if="
        rutaActual !== 'login' &&
        rutaActual &&
        rutaActual !== 'crear_contrasena'
      "
    ></app-side-bar>
    <app-toolbar
      v-if="
        rutaActual !== 'login' &&
        rutaActual &&
        rutaActual !== 'crear_contrasena'
      "
    ></app-toolbar>

    <v-idle
      v-if="env === 'production' && rutaActual !== 'login' && rutaActual"
      v-show="false"
      @idle="onidle"
      @remind="onremind"
      :loop="true"
      :reminders="[30]"
      :wait="5"
      :duration="360"
    />
    <v-main class="mb-10">
      <router-view />
    </v-main>
    <app-footer
      v-if="
        rutaActual !== 'login' &&
        rutaActual &&
        rutaActual !== 'crear_contrasena'
      "
    ></app-footer>
  </v-app>
</template>

<script>
import SideBarVue from "./components/app/SideBarApp.vue";
import FooterVue from "./components/app/FooterApp.vue";
import ToolbarVue from "./components/app/ToolbarApp.vue";
import auth from "./auth/auth";
import { mapState, mapActions } from "vuex";

export default {
  name: "App",
  components: {
    "app-side-bar": SideBarVue,
    "app-footer": FooterVue,
    "app-toolbar": ToolbarVue,
  },

  data: function () {
    return {
      rutaActual: "",
    };
  },
  computed: {
    ...mapState(["snackbar"]),
    env() {
      return process.env.NODE_ENV;
    },
  },
  methods: {
    ...mapActions([
      "mostrarAlerta",
      "cerrarAlerta",
      "set_timeout",
      "updateBits",
    ]),
    onidle() {
      auth.cerrarSesion();
      this.$router.push("/maximiza_vue/");
      alert("Se cerró su sesión por inactividad");
    },
    onremind(time) {
      let payload = {
        mensaje:
          "Se va a cerrar su sesión por inactividad en " + time + " segundos",
        color: "warning",
        mostrar: true,
      };
      this.mostrarAlerta(payload);
    },
  },

  mounted() {
    this.rutaActual = this.$route.name;
    if (auth.isAuthenticated()) {
      if (auth.isExpireSet()) this.set_timeout();
      else {
        auth.cerrarSesion();
        this.$router.push("/login");
      }
    }
  },
  watch: {
    "$route.name"(value) {
      this.rutaActual = value;
    },
  },
};
</script>

<style lang="css">
.alerta {
  font-family: "Open Sans", sans-serif;
  font-weight: 300;
  font-size: 20px;
}
.primaryGradient {
  background-image: linear-gradient(
    to right,
    #4285f4 0%,
    #2838c3 51%,
    #4285f4 100%
  );
}
.v-slide-group__prev {
  display: none !important;
}
.v-list-group
  .v-list-group__header
  .v-list-item__icon.v-list-group__header__append-icon {
  margin: 0;
  min-width: 0px !important;
}
.v-snack__content {
  padding: 0 !important;
}
.v-snack__action {
  display: none;
}
.v-data-table-header th {
  padding-top: 10px !important;
  vertical-align: top !important;
}
.titulo {
  font-size: 3.2vh;
  line-height: 3.5vh;
  word-break: normal;
  font-weight: 300;
}
.v-navigation-drawer__content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px #5d5d5d;
  background-color: #5d5d5d;
}
.v-navigation-drawer__content::-webkit-scrollbar {
  width: 0px;
}
.v-navigation-drawer__content::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px #424242;
  background-color: #424242;
}
.darkGlass {
  width: 100%;
  height: 100%;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.9);
  background-color: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(10px) !important;
}
</style>
