<template>
  <v-app :style="{ 
      'height':'100%',
      'background-image': 'url(' + require('@/assets/app/background.jpg') +')', 
      'background-position':'center',
      'background-attachment': 'fixed',
      'background-size': 'cover'}">
    <v-snackbar
      :timeout="6000"
      v-model="snackbar.mostrar"  
      app
      absolute
      centered
      top
      :color="snackbar.color"
      elevation="10"
      style="z-index: 99 !important;"
    >
      <v-row align="center" justify="space-around">
        <v-col cols="1">
          <v-icon left>{{snackbar.icon}}</v-icon>
        </v-col>
        <v-col cols="11">
          <h6 class="alerta">
            {{snackbar.mensaje}} 
          </h6>
        </v-col>
        
      </v-row>
   
      <template v-slot:action="{ attrs }">
        <v-btn
          icon
          v-bind="attrs"
          @click="cerrarAlerta()"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <app-side-bar v-if="rutaActual !== 'login' && rutaActual && rutaActual !== 'crear_contrasena'"></app-side-bar>
    <app-toolbar v-if="rutaActual !== 'login' && rutaActual && rutaActual !== 'crear_contrasena'"></app-toolbar>
    
  <v-idle
      v-if="rutaActual !== 'login' && rutaActual"
      v-show="false"
      @idle="onidle"
      @remind="onremind"
      :loop="true"
      :reminders="[30]"
      :wait="5"
      :duration="360"
    />
    <v-main class="mb-10" >
      <router-view/>
    </v-main>
    <app-footer v-if="rutaActual !== 'login' && rutaActual && rutaActual !== 'crear_contrasena'"></app-footer>
  </v-app>
</template>

<script>
import SideBarVue from './components/app/SideBar.vue';
import FooterVue from './components/app/Footer.vue';
import ToolbarVue from './components/app/Toolbar.vue';
import auth from './auth/auth';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'App',
  components: {

    'app-side-bar': SideBarVue,
    'app-footer': FooterVue,
    'app-toolbar': ToolbarVue,

  },

  data: function() {
    return {
      rutaActual:''
    }
  },
  computed: {
    ...mapState(["snackbar"]),
    },
  methods:{
    ...mapActions(["mostrarAlerta","cerrarAlerta"]),
    onidle() {
      auth.cerrarSesion();
      this.$router.push("/maximiza/");
      alert('Se cerró su sesión por inactividad');
    },
    onremind(time) {
      let payload = {
        mensaje: 'Se va a cerrar su sesión por inactividad en '+time+' segundos',
        color: 'warning',
        mostrar: true,
      }
      this.mostrarAlerta(payload)
    },
  },
    mounted(){
      this.rutaActual = this.$route.name;
    },
  watch: {
    "$route.name"(value) {
      this.rutaActual = value;
    }
  }
};
</script>

<style lang="css">
  .alerta {
    font-family: 'Open Sans', sans-serif;
    font-weight: 300;
    font-size:  20px;
  }
  .primaryGradient{
    background-image: linear-gradient(to right, #4285f4 0%, #2838c3 51%, #4285f4 100%);
  }
  .v-slide-group__prev {
    display: none !important;
    }
  .v-list-group .v-list-group__header .v-list-item__icon.v-list-group__header__append-icon {
      margin: 0;
      min-width: 0px !important;
  }
</style>
