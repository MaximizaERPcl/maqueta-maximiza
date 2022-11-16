<template>
  <v-container>
    <v-navigation-drawer
      v-model="drawer"
      app
      dark
      v-if="$route.name != 'home'"
      width="300px"
      min-width="300px"
      mobile-breakpoint="960"
      class="glass"
      tile
      height="100%"
    >
      <v-img 
        :src="require('../../assets/logos/logo.png')"
        max-width="280px"
        class="my-4 mx-2"
        contain
      ></v-img>

        <v-list>
          <v-list-group 
            link 
            color="white" 
            no-action
            v-if="userLogged"
            >
           <template v-slot:activator>
            <v-list-item-icon>
              <v-icon color="accent">mdi-account-cog</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="nombre">{{nombreUsuario}}</v-list-item-title>
              <v-list-item-subtitle>{{userRut}}</v-list-item-subtitle>
            </v-list-item-content>
            </template>
            <template v-slot:appendIcon>
              <v-icon style="margin-left:0 !important">mdi-menu-up</v-icon>
              </template>

            <v-list-item
              v-for="child in ajustesCuenta"
              :key="child.name"
              link
              :to="{ name: 'cuenta', params:{ajuste:child.to}}"

            >
              <v-list-item-content>
                <v-list-item-title v-text="child.name"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-icon >
              <v-icon small color="accent">{{child.icon}}</v-icon>
            </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </v-list>

        <v-divider></v-divider>

        <v-list
          nav
        >
          <v-list-item link :to="{name:items[0].to}" color="white">
            <v-list-item-icon >
              <v-icon color="accent">{{items[0].icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{items[0].name}}</v-list-item-title>
          </v-list-item>
  
          <v-list-group link :to="{name:items[1].to}" color="white" no-action append-icon="mdi-menu-up">
           <template v-slot:activator>
              <v-list-item-icon >
                <v-icon color="accent">{{items[1].icon}}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{items[1].name}}</v-list-item-title>
            </template>

            <v-list-item
              v-for="child in items[1].productos"
              :key="child.name"
              link
              :to="{ name: items[1].to, params: {product: child.param}}"
            >
              <v-list-item-content>
                <v-list-item-title v-text="child.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
    
          <v-list-item link :to="{name:items[2].to}" color="white">
            <v-list-item-icon >
              <v-icon color="accent">{{items[2].icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{items[2].name}}</v-list-item-title>
          </v-list-item>

          <v-list-item link :to="{name:items[3].to}" color="white">
            <v-list-item-icon >
              <v-icon color="accent">{{items[3].icon}}</v-icon>
            </v-list-item-icon>
            <v-list-item-title>{{items[3].name}}</v-list-item-title>
          </v-list-item>
        </v-list>


      <template v-slot:append>
        <!--v-img 
          :src="require('../../assets/logos/logo.png')"
          max-width="280px"
          class="my-4 mx-2"
          contain
        ></v-img-->
        <div class="pa-2">
          <v-btn @click="logout" block color="error">
            Cerrar Sesión
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
  </v-container>

</template>

<script>
  import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
  import auth from "@/auth/auth";
  import { formatterRut } from 'chilean-formatter';

  export default {
    data: () => ({
        items: [
            {name: 'Inicio', icon:'mdi-home', to:"ingresa", subgroup:false},
            {name: 'Productos', icon:'mdi-briefcase-account', to:"productos", subgroup:true,
                productos: [
                    {name: 'Cuenta Capital', param:'cuenta-capital'}, //
                    {name: 'Cuenta de Ahorro', param:'cuenta-ahorro'}, //
                    {name: 'Remanentes', param:'remanentes'},
                    {name: 'Depósito a plazo', param:'dap'},//
                    {name: 'Créditos', param:'creditos'},//
                    {name: 'Próximos Pagos', param:'proximos-pagos'},
                    //{name: 'Firma Legale', param:'firma'},
                ]},
            {name: 'Simulador de créditos', icon:'mdi-credit-card', to:"creditos", subgroup:false},
            {name: 'Simulador Dap', icon:'mdi-bank-transfer-in', to:"dap", subgroup:false},
            {name: 'Ajustes Cuenta', icon:'mdi-account-cog', to:"cuenta", subgroup:false},
        ],
        ajustesCuenta:[
          //{name: 'Actualizar Datos', to:'actualizar-datos', icon: 'mdi-account-details'}, //
          {name: 'Cambiar Clave', to:'cambiar-clave', icon:'mdi-account-lock'}, //
        ],
        finalItems: [
            {name: 'Atención Socios', icon:'mdi-phone'},
        ],
        userLogged:null,
    }),
    computed:{
      userRut(){
        return formatterRut(this.userLogged.rut)
      },
      nombreUsuario(){
        let nombre = this.userLogged.nombres.split(' ')[0].charAt(0).toUpperCase() + this.userLogged.nombres.toLowerCase().slice(1);
        let apellido = this.userLogged.apellido_paterno.split(' ')[0].charAt(0).toUpperCase() + this.userLogged.apellido_paterno.toLowerCase().slice(1);
        return nombre + ' ' + apellido
      },
      ...mapGetters({
        drawerTest: 'drawer'
      }),
      drawer: {
           get(){
             return this.drawerTest
           },
           set(state){
            this.switchDrawer(state)
            return state
           } 
        }
    },
    async created(){
      await this.getUserLogged();
      if(this.$route.name){
        let ruta = this.$route.name;
        var indiceRuta = this.items.findIndex( item => item.to === ruta);
        this.cambiarRuta(this.items[indiceRuta].name);
      }
      
    },
    methods:{
      async getUserLogged() {
        await auth.getCryptKey()
        .then(response => {
          let key  = response.data[0].crypt_key;
          this.userLogged = auth.getUserLogged(key);
        })
      },
      ...mapMutations([
        'cambiarRuta',
      ]),
      ...mapActions(['switchDrawer']),
      logout(){
        auth.cerrarSesion(); 
        this.$router.push({name:'login'});
      }
    },
    watch: {
      "$route.name": {
        handler(value){
          var indiceRuta = this.items.findIndex( item => item.to === value);
          this.cambiarRuta(this.items[indiceRuta].name);
        },
        deep: true
      }
    }
  }
</script>
<style scoped lang="css">
  .glass {
    width: 100%;
    height: 100%;
    box-shadow: 0 0 1rem 0 rgba(0, 0, 0, .2);   
    background-color: rgba(66, 133, 244, 0.3);
    backdrop-filter: blur(10px);
  }
  .transparente {
    background-color: transparent;
  }

  .nombre{
    white-space: normal;
    font-weight: 400;
    font-size:  18px;
    line-height : 18px;
  }

</style>