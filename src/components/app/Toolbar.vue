<template>
  <div>
    <v-app-bar
      app
      dense
      dark
      tile
      style="background-color: rgba(66, 133, 244, 0.3); border-radius: 5px;  backdrop-filter: blur(5px);box-shadow: 0 0 1rem 0 rgba(0, 0, 0, .2);"
    >
    <v-app-bar-nav-icon class="hidden-md-and-up" @click.stop="switchDrawer(true)"></v-app-bar-nav-icon>
    <v-icon x-large>mdi-menu-right</v-icon>
      <v-toolbar-title class="mx-2 cabecera">{{this.rutaActual}}</v-toolbar-title>
      <!--v-btn text>
        <v-icon color="primary" left>mdi-phone</v-icon>
        Atención Socios
      </v-btn-->
      <!--v-btn text>
        <v-icon color="primary" left>mdi-account-lock</v-icon>
        Actualizar Clave
      </v-btn-->
    </v-app-bar>
  </div>
</template> 

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data: function() {
    return {

    }
  },
  methods:{
    ...mapActions(['switchDrawer'])
  },
  computed:{
    ...mapState(['rutaActual'])
  },
  mounted(){
  }
}
</script>

<style scoped lang="css">
  .cabecera {
    font-weight: 300;
    font-size:  25px;
    line-height : 25px;
  
  }
</style>