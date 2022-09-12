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
          v-for="link in links"
          :key="link"
          color="white"
          text
          :small="!mobile"
          :x-small="mobile"
          :block="mobile"
          rounded
          class="my-1"
          style="pointer-events:none;"
        >
          <span :class=" mobile ? 'texto-footer' : ''">
            {{ link }}
          </span>
        </v-btn>
        <v-col
          class="primary text-center white--text"
          cols="12"
        >
          {{ new Date().getFullYear() }} - Copyright: <strong> maximiza.cl</strong>
        </v-col>
      </v-row>
    </v-footer>
</template>


<script>
import { mapActions } from 'vuex'

  export default {
    data: () => ({
      links: [
        'contacto@maximiza.cl',
        'Casa Matriz: Cerro Colorado #5870 Oficina 110 Las Condes',
        '+560229536459',
      ],
    }),
    methods:{
      ...mapActions(['switchDrawer'])
    },
    computed: {
      mobile () {
        switch (this.$vuetify.breakpoint.name) {
          case 'xs': return true
          case 'sm': return true
          case 'md': return false
          case 'lg': return false
          case 'xl': return false
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