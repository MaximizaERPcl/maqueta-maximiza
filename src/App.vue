<template>
  <v-app>
    <app-side-bar v-if="rutaActual !== 'login' && rutaActual"></app-side-bar>
    <app-toolbar v-if="rutaActual !== 'login' && rutaActual"></app-toolbar>
    
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
