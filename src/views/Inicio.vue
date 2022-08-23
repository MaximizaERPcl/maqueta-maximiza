
<template>
<v-container>
  <v-row
    justify="center"
    >
    <v-col
      cols="10"> 
      <v-card
          outlined
      >
      <v-toolbar
        color="primary"
        dark
        flat
        tile
        dense
      >
        <v-toolbar-title>Bienvenido/a <span v-if="userLogged"> {{user.nombre}}</span></v-toolbar-title>

      </v-toolbar>
      <v-card-title class="text-h5 mb-1">
            {{user.name}}
      </v-card-title>
      
      <v-toolbar
        color="primary"
        dark
        flat
        tile
        dense
      >
          <v-toolbar-title>Información Personal</v-toolbar-title>
      </v-toolbar>

      <v-list two-line>
        <v-list-item v-if="user.direccion_particular !== ''">
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-map-marker
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-subtitle>Dirección</v-list-item-subtitle>
            <v-list-item-title>{{user.direccion_particular}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="user.Movil !== ''">
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-cellphone
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-subtitle>Celular</v-list-item-subtitle>
            <v-list-item-title>{{user.Movil}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="user.telefono_particular !== ''">
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-phone
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-subtitle>Teléfono</v-list-item-subtitle>
            <v-list-item-title>{{user.telefono_particular}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-if="user.email !== ''">
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-email
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-subtitle>Correo </v-list-item-subtitle>
            <v-list-item-title>{{user.email}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        </v-list>
      </v-card>
    </v-col>
  </v-row>
  <v-row
    justify="center"
  >
    <v-col
    cols="10"
    >
    <v-row
      justify="center"
      align="stretch"
    >
    <v-col v-for="product in products">
      <v-card
        outlined
        height="140px"
      >
      <v-toolbar
        color="primary"
        dark
        flat
        tile
        dense
      >
      <v-icon left>{{product.icon}}</v-icon>
        <v-toolbar-title>{{product.type}}</v-toolbar-title>

      </v-toolbar>
      <v-card-title class="text-h5">
        {{(product.status !== "0")? Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(product.amount) : "No posee"}}
      </v-card-title>
      <v-card-subtitle v-if="product.status !== '0' && product.type === 'Créditos'">
      Total Adeudado
      </v-card-subtitle>

      </v-card>
      </v-col>
        </v-row>
    </v-col>
        </v-row>
    
    
</v-container>
</template>
<script>

import auth from "@/auth/auth";
import socio from "@/services/socio";
export default {
  name: 'App',
  data: function () {
    return {
      user: {},
      products: [
        {type: 'Créditos', status: "0", amount:0, icon:'mdi-credit-card'},
        {type: 'Depósitos a plazo', status: "0", amount:0, icon: 'mdi-bank-transfer-in'},
        {type: 'Cuenta de ahorro', status: "0", amount:0, icon:'mdi-account-cash'},
        {type: 'Cuenta capital', status: "0", amount:0, icon:'mdi-cash'},

      ]
  }},
  methods:{
    async getInfoCliente(){
      let id_cliente = this.userLogged.rut.split('-')[0];
      await auth.userInfo(id_cliente)
      .then(response => {
        this.user = response.data[0];
        this.setProductos();
        
      })
      .catch(error => console.log(error))
    },

    async setProductos(){
      if(this.user.creditos !== "0"){

        await socio.getCreditos(this.userLogged.id_cliente)
        .then(response => {
          let creditos = response.data;
          if(creditos.length > 0){
            
            this.products[0].status = this.user.creditos;
            let montoFinal = 0;
            creditos.forEach(credito => {
              montoFinal += parseInt(credito.saldo.split('.').join(""));
            });
            this.products[0].amount = montoFinal;
          }
        })
        .catch(error => console.log(error));
      }

      if(this.user.dap !== "0"){
        
        await socio.getDap(this.userLogged.id_cliente)
        .then(response => {
          let daps = response.data;
          if(daps.length > 0){
            this.products[1].status = this.user.dap;
            let montoFinal = 0;
            daps.forEach(dap => {
              montoFinal += parseInt(dap.monto_final.split('.').join(""));
            });
            this.products[1].amount = montoFinal;
          } 
        })
        .catch(error => console.log(error));
        
      }

      if(this.user.libretas !== "0"){

        await socio.getLibretas(this.userLogged.id_cliente)
        .then(response => {
          let libretas = response.data;
          if(libretas.length > 0){
            console.log(libretas)
            this.products[2].status = this.user.libretas;
            let montoFinal = 0;
            libretas.forEach(libreta => {
              montoFinal += parseInt(libreta.saldo.split('.').join(""));
            });
            this.products[2].amount = montoFinal;
          }
        })
        .catch(error => console.log(error));
      }
      if(this.user.cuenta_capital !== "0"){
        
        await socio.getCuentaCapital(this.user.rut)
        .then(response => {
          let cuentas = response.data;
          if(cuentas.length > 0){
            this.products[3].status = this.user.cuenta_capital;
            let montoFinal = 0;
            cuentas.forEach(cuenta => {
              montoFinal += parseInt(cuenta.saldo.split('.').join(""));
            });
            this.products[3].amount = montoFinal;
          }
        })
        .catch(error => console.log(error));
        //traer monto
      }

    }
  },
  computed:{
    userLogged() {
      return auth.getUserLogged();
    }
  },
  mounted(){
    this.getInfoCliente()
  }
};
</script>