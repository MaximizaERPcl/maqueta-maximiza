<template>
    <v-footer
      color="secondary"
      padless
      :app="!mobile"
      inset
    >
      
      <v-row
        justify="space-around"
        no-gutters
      >
      <v-btn
      color="white"
      text
      x-small
      :block="mobile"
      rounded
      class="my-1"
      @click="copiarTexto('mesa.ayuda@maximizaerp.cl')"
    >
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <span
            v-bind="attrs"
            v-on="on"
            @mouseleave="copyText = 'Copiar'"
            :class="mobile ? 'texto-footer' : ''"
          >
            {{ links[0].name }}
          </span>
        </template>
        <span>{{ copyText }}</span>
      </v-tooltip>
    </v-btn>
    <v-btn
      color="white"
      text
      x-small
      :block="mobile"
      rounded
      class="my-1"
      :href="links[1].link"
      target="_blank"
    >
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <span
            v-bind="attrs"
            v-on="on"
            :class="mobile ? 'texto-footer' : ''"
          >
            {{ links[1].name }}
          </span>
        </template>
        <span>{{ "Ver en Google Maps" }}</span>
      </v-tooltip>
    </v-btn>
    <v-btn
      color="white"
      text
      x-small
      :block="mobile"
      rounded
      class="my-1"
      @click="copyText('+56999231921')"
    >
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <span
            v-bind="attrs"
            v-on="on"
            :class="mobile ? 'texto-footer' : ''"
            @mouseleave="copyText = 'Copiar'"
          >
            {{ links[0].name }}
          </span>
        </template>
        <span>{{ copyText }}</span>
      </v-tooltip>
    </v-btn>
        <v-col
          class="primary text-center white--text"
          cols="12"
        >
          {{ new Date().getFullYear() }} - Copyright: <strong>www.maximizaerp.cl</strong>
        </v-col>
      </v-row>
    </v-footer>
</template>


<script>
import { mapActions } from 'vuex'

  export default {
    data: () => ({
      copyText: "Copiar",
      links: [
      {
        name: "mesa.ayuda@maximizaerp.cl",
      },
      {
        name: "Casa Matriz: Cerro Colorado #5870 Oficina 110 Las Condes",
        link: "https://goo.gl/maps/TR4NT9UCAgqAXCAH9",
      },
      { name: "+56 9 9923 1921" },
    ],
    }),
    methods:{
      ...mapActions(['switchDrawer']),
      copiarTexto(value) {
      navigator.clipboard.writeText(value);
      this.copyText = "Copiado !";
    },
    },
    computed: {
      mobile () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return true
          case 'sm': return true
          case 'md': return false
          case 'lg': return false
          case 'xl': return false
          default: return false
        }
      },
    },
    mounted(){
      if(this.mobile){
        this.switchDrawer(false)
      }
    }
  }
</script>
<style scoped lang="css">
  .texto-footer{
    width: min-content; 
    white-space: normal; 
    flex: auto
  }
</style>