<template>
  <v-app>
    <!--v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar-->
    <app-side-bar v-if="rutaActual != 'login'"></app-side-bar>
    <app-toolbar v-if="rutaActual != 'login'"></app-toolbar>
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
  beforeMount(){
      this.rutaActual = this.$route.name;
    },
  watch: {
    "$route.name"(value) {
      this.rutaActual = value;
      console.log(value)
    }
  }
};
</script>
