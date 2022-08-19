<template>
  <div>
    <v-app-bar
      dense
      color="white"
      absolute
      app
      class="py=0 my-0"
    >
      <!--v-app-bar-nav-icon></v-app-bar-nav-icon-->
      <v-toolbar-title>{{this.rutaActual}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text>
        <v-icon color="primary" left>mdi-phone</v-icon>
        Atención Socios
      </v-btn>
      <v-btn text>
        <v-icon color="primary" left>mdi-account-lock</v-icon>
        Actualizar Clave
      </v-btn>
    </v-app-bar>
  </div>
</template> 

<script>
import { mapState } from 'vuex';

export default {
  data: function() {
    return {

    }
  },

  computed:{
    ...mapState(['rutaActual'])
  }
}
</script>

<style scoped>
 .v-toolbar__content  {
  padding: 0px !important;
}
</style>