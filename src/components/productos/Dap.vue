<template>
  <v-container class="py-0">
    <v-row
    justify="center"
    >
      <v-col
        cols="11"> 
        <v-card
      elevation="10"
      >
          <v-toolbar
            color="primary"
            dark
            flat
            tile
            class="mb-4 primaryGradient"
          >
            <v-toolbar-title class="flex text-center titulo">Depósito a Plazo</v-toolbar-title>
          </v-toolbar>
          <v-row
            class="fill-height mb-4"
            align-content="center"
            justify="center"
            v-if="loading"
          >
            <v-col
              class="text-subtitle-1 text-center"
              cols="12"
            >
              Cargando Datos
            </v-col>
            <v-col cols="6">
              <v-progress-linear
                color="primary"
                indeterminate
                rounded
                height="10"
              ></v-progress-linear>
            </v-col>
          </v-row>
          <div v-else>
          <app-no-datos v-if="noDatos" v-bind:msg="msg"></app-no-datos>
          <v-container v-else>            
            <v-data-table 
              :headers="cabeceras"
              :items="daps"
              class="elevation-1"
            >
              <template
                v-slot:item.monto_final="{ item }"
              >
                {{ conv.formatMonto(item.monto_final,true) }}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn @click="mostrarDetalle(item)" icon>
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        >
                        mdi-magnify-expand
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Detalle</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </v-container>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <app-detalle v-if="dialog.state" :dialog="dialog"></app-detalle>
  </v-container>
</template>

<script>
import auth from '@/auth/auth';
import socio from '@/services/socio';
import NoDataVue from '../app/NoData.vue';
import DetalleDapVue from './dialogos/DetalleDap.vue';
import conv from '@/services/conversores';

export default {
  components: {
      'app-no-datos': NoDataVue,
      'app-detalle': DetalleDapVue
  },
  data: function() {
    return {
      cabeceras: [
        {
          text: 'N° Cuenta',
          align: 'start',
          sortable: true,
          value: 'n_cuenta',
        },
        { text: 'Producto',
          align: 'start',
          sortable: true, 
          value: 'producto' 
        },
        { text: 'Oficina',
          align: 'start',
          sortable: true, 
          value: 'oficina' 
        },
        { text: 'Estado',
          align: 'start',
          sortable: true, 
          value: 'estado' 
        },
        { text: 'Monto',
          align: 'start',
          sortable: true, 
          value: 'monto_final' 
        },
        { text: 'Fecha Apertura',
          align: 'start',
          sortable: true, 
          value: 'f_apertura' 
        },
        { text: 'Fecha Vencimiento',
          align: 'start',
          sortable: true, 
          value: 'f_vencimiento' 
        },

        { text: '', value: 'actions', sortable: false },
      ],
      daps: [],
      noDatos: false,
      msg:'NO POSEE DEPÓSITOS A LARGO PLAZO ASOCIADOS',
      dialog: {state:false, data:{}, user:{}},
      loading:true,
      userLogged:null
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
    async getDap(){
      await socio.getDap(this.userLogged.id_cliente)
      .then(response => {    
        this.daps = response.data;
      })
      .catch(error => console.log(error));
    },
    mostrarDetalle(item){
      this.dialog.data = item;
      this.dialog.user = this.userLogged;
      this.dialog.state = true;
    },
  },
  computed:{
    conv(){
      return conv;
    }
  },
  async mounted(){
    await this.getUserLogged();
    this.loading = true;
    if(this.userLogged.info.dap != "0"){
      this.noDatos = false;
      await this.getDap();
    }
    else
      this.noDatos = true;

    this.loading = false;
  }
}
</script>

<style scoped lang="css">
.titulo { 
    font-size:30px;
    line-height : 30px;
    word-break:normal;
    font-weight: 300;
  }
.cabecera {
  color: white;
  font-weight: 300;
  font-size:  22px;
  line-height : 22px;

}
</style>