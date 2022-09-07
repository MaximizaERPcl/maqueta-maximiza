<template>
  <v-app>
    <app-side-bar v-if="rutaActual !== 'login' && rutaActual"></app-side-bar>
    <app-toolbar v-if="rutaActual !== 'login' && rutaActual"></app-toolbar>
    <v-snackbar
      :timeout="6000"
      v-model="snackbar.mostrar"  
      app
      absolute
      centered
      top
      :color="snackbar.color"
      elevation="10"
    >
    
    <h6 class="alerta" >
      <v-icon left>{{snackbar.icon}}</v-icon>
      {{snackbar.mensaje}} </h6>
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
    <v-idle
        v-if="rutaActual !== 'login'"
        v-show="false"
        @idle="onidle"
        @remind="onremind"
        :loop="true"
        :reminders="[30]"
        :wait="5"
        :duration="360"
      />
    <v-main>
      <router-view/>
    </v-main>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import SideBarVue from './components/app/SideBar.vue';
import FooterVue from './components/app/Footer.vue';
import ToolbarVue from './components/app/Toolbar.vue';
import { mapState, mapActions } from 'vuex';
import auth from './auth/auth';

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
      console.log('entra')
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

<style scoped lang="css">
  .alerta {
    font-family: 'Open Sans', sans-serif;
    font-weight: 400;
    font-size:  20px;
  }
</style>
