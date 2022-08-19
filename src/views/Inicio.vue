
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
      >
        <v-toolbar-title>Bienvenido/a</v-toolbar-title>

      </v-toolbar>
      <v-card-title class="text-h5 mb-1">
            {{user.name}}
      </v-card-title>
      
      <v-toolbar
        color="primary"
        dark
        flat
        tile
      >
          <v-toolbar-title>Información Personal</v-toolbar-title>
      </v-toolbar>

      <v-list two-line>
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-map-marker
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-subtitle>Dirección</v-list-item-subtitle>
            <v-list-item-title>{{user.address}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
          <v-list-item-icon>
            <v-icon color="primary">
              mdi-phone
            </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-subtitle>Teléfono</v-list-item-subtitle>
            <v-list-item-title>{{user.phone}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item>
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
    >
    <v-col v-for="product in products">
      <v-card
        outlined
      >
      <v-toolbar
        color="primary"
        dark
        flat
        tile
      >
      <v-icon left>{{product.icon}}</v-icon>
        <v-toolbar-title>{{product.type}}</v-toolbar-title>

      </v-toolbar>
      <v-card-title class="text-h5 mb-1">
            {{Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(product.amount)}}
      </v-card-title>

      </v-card>
      </v-col>
        </v-row>
    </v-col>
        </v-row>
    
    
</v-container>
</template>
<script>

export default {
  name: 'App',
  data: () => ({
    user: {
      name:'Valentina Ligueño',
      address:'Calle Ramon Freire 455 , Comuna de Lampa, Región Metropolitana',
      phone: '950121461',
      email:'valentina.ligueno@gmail.com'
    },
    products: [
      {type: 'Créditos', amount: 1286651, icon:'mdi-credit-card'},
      {type: 'Depósitos a plazo', amount: 0, icon: 'mdi-bank-transfer-in'},
      {type: 'Cuenta de ahorro', amount: 129239, icon:'mdi-account-cash'},
      {type: 'Cuenta capital', amount: 182914, icon:'mdi-cash'},

    ]
  }),
};
</script>