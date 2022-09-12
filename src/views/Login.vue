<template>
<v-container fill-height fluid>
  <v-container fill-height fluid>
    <v-row 
      align="center"
      justify="center">
      <v-col
        cols="12"
        sm="10"
        md="6"
        class="glass px-0" 
        >
      <v-card 
        class="pb-6"
        color="transparent"
        outlined
        >
        <v-tabs
          v-if="actualPath !== 'crear_contrasena'"
          v-model="tab"
          fixed-tabs
          icons-and-text
          background-color="transparent"
          color="primary"
          
        >
          <v-tab class="mx-0 px-0">
            Ingresar
            <v-icon>mdi-account</v-icon>
          </v-tab>
          <v-tab class="mx-0 px-0">
            Generar Clave
            <v-icon>mdi-account-plus</v-icon>
          </v-tab>
          <v-tab class="mx-0 px-0">
            Olvidé Mi Clave
            <v-icon>mdi-account-alert</v-icon>
            </v-tab>
        </v-tabs>
        <v-divider v-if="actualPath !== 'crear_contrasena'"></v-divider>
        <v-img
          src="../assets/logos/logo.png"
          contain
          aspect-ratio="5.5"
          class="mt-5 mx-5"


        ></v-img>

        <v-tabs-items class="transparente" v-model="tab" v-if="actualPath !== 'crear_contrasena'">
          <v-tab-item
            :key="0"
          >
            <app-login></app-login>
          </v-tab-item>


          <v-tab-item
            :key="1"
          >
            <app-generar-clave></app-generar-clave>
          </v-tab-item>


          <v-tab-item
            :key="2"
          >
            <app-olvido-clave></app-olvido-clave>
          </v-tab-item>
        </v-tabs-items>
        <app-recuperar-clave v-else></app-recuperar-clave>

        
        
      </v-card>
      
      </v-col>
    </v-row>
</v-container>
  
</v-container>
</template>

<script>
import auth from "@/auth/auth";
import GenerarClaveVue from "@/components/login/GenerarClave.vue";
import LoginVue from "@/components/login/Login.vue";
import OlvidoClaveVue from "@/components/login/OlvidoClave.vue";
import RecuperarClaveVue from "@/components/login/RecuperarClave.vue";

import { mapState } from 'vuex';

export default {
    components: {
      'app-generar-clave': GenerarClaveVue,
      'app-login': LoginVue,
      'app-olvido-clave': OlvidoClaveVue,
      'app-recuperar-clave': RecuperarClaveVue
    },
    data: function () {
        return {
          alert:false,
          alertMsg:"",
          tab: 0,
          actualPath:'',
        };
    },
    computed: {
      ...mapState(["rutaActual"]),
    },
    methods:{
      //
    },
    mounted(){
      this.actualPath = this.$route.name;

    }, 
    watch: {
      "$route.name"(value) {
        this.actualPath = value;
      }
    }
}
</script>
<style scoped lang="css">
  .glass {
    width: 100%;
    height: 100%;
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, .2);   
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.35);
    backdrop-filter: blur(10px);
  }
  .transparente {
    background-color: transparent;
  }
</style>