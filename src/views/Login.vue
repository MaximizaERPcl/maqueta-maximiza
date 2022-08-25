<template>
<v-container fill-height fluid style="height:100%; background-image: linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%);">
  <v-snackbar
      :timeout="4000"
      :value="alert"
      absolute
      centered
      top
      color="error"
      elevation="20"
    >
    <v-icon left>mdi-alert-circle</v-icon>
      {{alertMsg}}
    <template v-slot:action="{ attrs }">
        <v-btn
          icon
          v-bind="attrs"
          @click="alert = false"
        >
          <v-icon>mdi-close-circle-outline</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  <v-container fill-height fluid>
    <v-row 
      align="center"
      justify="center">
      <v-col cols="5">
      <v-card class="pb-6 elevation-4">
        <v-tabs 
          fixed-tabs
          icons-and-text
          v-model="tab"
        >
          <v-tab>
            Ingresar
            <v-icon>mdi-account</v-icon>
          </v-tab>
          <v-tab>
            Generar Clave
            <v-icon>mdi-account-plus</v-icon>
          </v-tab>
          <v-tab>
            Olvidé Mi Clave
            <v-icon>mdi-account-alert</v-icon>
            </v-tab>
        </v-tabs>
        <v-divider></v-divider>
        <v-img
          src="../assets/inicio/logoHQ.png"
          contain
          aspect-ratio="4"
          class="my-5"    

        ></v-img>

        <v-tabs-items v-model="tab">
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

import { mapState } from 'vuex';

export default {
    components: {
      'app-generar-clave': GenerarClaveVue,
      'app-login': LoginVue,
      'app-olvido-clave': OlvidoClaveVue
    },
    data: function () {
        return {
          alert:false,
          alertMsg:"",
          tab: 0,
        };
    },
    computed: {
      ...mapState(["rutaActual"]),
    },
    methods:{
      //
    },
}
</script>