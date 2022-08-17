<template>

      <v-navigation-drawer
        permanent
        app
        v-if="$route.name != 'home'"
      >
        <v-list>
          <v-list-item class="p-5">
              <v-img 
                :src="require('../assets/inicio/logo.png')"
                aspect-ratio="2.5"
                contain
              ></v-img>
          </v-list-item>

          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                Valentina Ligueño
              </v-list-item-title>
              <v-list-item-subtitle>valentina.ligueno@gmail.com</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list
          nav
        >
          <v-list-item link :to="items[0].to" color="primary">
            <v-list-item-icon >
              <v-icon color="primary">{{items[0].icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{items[0].name}}</v-list-item-title>
          </v-list-item>
  
          <v-list-group link :to="items[1].to" color="primary" no-action>
           <template v-slot:activator>
              <v-list-item-icon >
                <v-icon color="primary">{{items[1].icon}}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{items[1].name}}</v-list-item-title>
            </template>

            <v-list-item
              v-for="child in items[1].productos"
              :key="child.name"
              link
            >
              <v-list-item-content>
                <v-list-item-title v-text="child.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
    
          <v-list-item link :to="items[2].to" color="primary">
            <v-list-item-icon >
              <v-icon color="primary">{{items[2].icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{items[2].name}}</v-list-item-title>
          </v-list-item>

          <v-list-item link :to="items[3].to" color="primary">
            <v-list-item-icon >
              <v-icon color="primary">{{items[3].icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{items[3].name}}</v-list-item-title>
          </v-list-item>
        </v-list>


        <template v-slot:append>
            <v-list
            nav
            v-for="item in finalItems"
            >
            <v-list-item link >
                <v-list-item-icon >
                <v-icon color="primary">{{item.icon}}</v-icon>
                </v-list-item-icon>
                <v-list-item-title>{{item.name}}</v-list-item-title>
            </v-list-item>
            </v-list>
            
        <div class="pa-2">
          <v-btn block color="error">
            Cerrar Sesión
          </v-btn>
        </div>
      </template>
      </v-navigation-drawer>

</template>

<script>
  export default {
    data: () => ({
        items: [
            {name: 'Información General', icon:'mdi-home', to:"ingresa", subgroup:false},
            {name: 'Productos', icon:'mdi-briefcase-account', to:"", subgroup:true,
                productos: [
                    {name: 'Cuenta Capital'},
                    {name: 'Remanentes'},
                    {name: 'Deposito a plazo'},
                    {name: 'Creditos'},
                    {name: 'Proximos Pagos'},
                    {name: 'Firma'},
                ]},
            {name: 'Simulador de créditos', icon:'mdi-credit-card', to:"/maximiza/simulador-creditos", subgroup:false},
            {name: 'Simulador Dap', icon:'mdi-bank-transfer-in', to:"/maximiza/simulador-dap", subgroup:false},

        ],
        finalItems: [
            {name: 'Atención Socios', icon:'mdi-phone'},
            {name: 'Actualizar Clave', icon:'mdi-account-lock' },
        ]
    })
  }
</script>