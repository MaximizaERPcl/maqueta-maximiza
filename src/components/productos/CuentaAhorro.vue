<template>
  <v-container class="py-0">
    <v-row
    justify="center"
    >
      <v-col
        cols="11"> 
        <v-card
          outlined
          
        >
          <v-toolbar
            color="primary"
            dark
            flat
            tile
            class="mb-4"
          >
            <v-toolbar-title class="flex text-center titulo">Cuenta de Ahorro</v-toolbar-title>
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
              :items="ctaAhorro"
            >
              <template
                v-slot:item.saldo="{ item }"
              >
                {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.saldo) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon @click="mostrarDetalle(item)">
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
import NoDataVue from '../app/NoData.vue';
import auth from '@/auth/auth';
import socio from '@/services/socio';
import DetalleCtaAhorroVue from './dialogos/DetalleCtaAhorro.vue';

export default {
  components: {
      'app-no-datos': NoDataVue,
      'app-detalle': DetalleCtaAhorroVue

  },
  data: function() {
    return {
      cabeceras: [
        { text: 'N° Cuenta',
          align: 'start',
          sortable: true, 
          value: 'id_libreta' 
        },
        {
          text: 'Producto',
          align: 'start',
          sortable: true,
          value: 'nombre',
        },
        { text: 'Fecha Apertura',
          align: 'start',
          sortable: true, 
          value: 'f_apertura' 
        },
        { text: 'Saldo',
          align: 'start',
          sortable: true, 
          value: 'saldo' 
        },
         { text: 'Último Abono',
          align: 'start',
          sortable: true, 
          value: 'fecha_ultimo_abono' 
        },
        { text: '', value: 'actions', sortable: false },
      ],
      ctaAhorro: [],
      msg:'NO POSEE CUENTAS DE AHORRO ASOCIADAS',
      noDatos: false,
      dialog: {state:false, data:{}, user:{}},
      loading:true,
    }
  },
  methods:{
    async getCuentaAhorro(){
      await socio.getLibretas(this.userLogged.id_cliente)
      .then(response => {
        console.log(response.data)
        if(response.data.length == 0){
          this.noDatos = true;
        }
        else{
          this.ctaAhorro = response.data;
          this.noDatos = false;
        }
      })
      .catch(error => console.log(error));
    },

    mostrarDetalle(item){
      this.dialog.data = item;
      this.dialog.user = this.userLogged;
      this.dialog.state = true;
    }
  },

  computed:{
    userLogged() {
      return auth.getUserLogged();
    },
  },
  async mounted(){
    this.loading = true;
    await this.getCuentaAhorro();
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