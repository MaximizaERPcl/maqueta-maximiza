<template>
  <v-container class="py-0">
    <v-row
    justify="center"
    no-gutters
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
            <v-toolbar-title class="flex text-center titulo">Cuenta Capital</v-toolbar-title>
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
              :headers="cabeceras1"
              :items="ctaCapital"
              class="mx-4 mb-4 elevation-1"
            >
              <template
                v-slot:item.saldo="{ item }"
              >
                {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.saldo) }}
              </template>
              <template
                v-slot:item.cuota_participacion="{ item }"
              >
                {{ Math.round(item.cuota_participacion)}}
              </template>

              <template v-slot:item.actions="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon>
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        >
                        mdi-magnify-expand
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>Ver Más</span>
                </v-tooltip>
              </template>
            </v-data-table>

            <v-data-table 
              :headers="cabeceras2"
              :items="detalleCta"
              class="mx-4 mb-2 elevation-1"
            >
              <template
                v-slot:item.saldo="{ item }"
              >
                {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.saldo) }}
              </template>
              <template
                v-slot:item.monto="{ item }"
              >
                {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.monto) }}
              </template>

              <template v-slot:top>
                <v-system-bar
                flat
                outlined
                dense
                :color="colorCabeceras"
                height="40" 
                >
                  <v-toolbar-title class="flex text-center cabecera">Detalle Cuenta Capital</v-toolbar-title>
                </v-system-bar>
              </template>
            </v-data-table>
            </v-container>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import socio from '@/services/socio';
import auth from '@/auth/auth';
import NoDataVue from '../app/NoData.vue';

export default {
  components: {
      'app-no-datos': NoDataVue,
  },
  data: function() {
    return {
      cabeceras1: [
        {
          text: 'Producto',
          align: 'start',
          sortable: true,
          value: 'producto',
        },
        { text: 'Vigente',
          align: 'start',
          sortable: true, 
          value: 'vigente' 
        },
        { text: 'Cantidad de cuotas',
          align: 'start',
          sortable: true, 
          value: 'cuota_participacion' 
        },
        { text: 'Saldo',
          align: 'start',
          sortable: true, 
          value: 'saldo' 
        },
      ],
      cabeceras2: [
        {
          text: 'Fecha',
          align: 'start',
          sortable: true,
          value: 'fecha',
        },
        { text: 'Tipo de Movimiento',
          align: 'start',
          sortable: true, 
          value: 'tipo_mov' 
        },
        { text: 'Monto',
          align: 'start',
          sortable: true, 
          value: 'monto' 
        },
        { text: 'Saldo',
          align: 'start',
          sortable: true, 
          value: 'saldo' 
        },
      ],
      colorCabeceras:'indigo darken-1',
      ctaCapital: [],

      detalleCta: [],
      cuenta_capital:{},
      noDatos: false,
      msg:'NO POSEE CUENTAS CAPITALES ASOCIADAS',
      loading: true,
    }
  },
  methods:{
    async getCuentaCapital(){
      await socio.getCuentaCapital(this.userLogged.rut)
      .then(response => {
        if(response.data[0].length == 0)
          this.noDatos = true;
        
        else{
          this.noDatos = false;
          this.ctaCapital = response.data;
          this.getCuentaCapitalDetalle();
        }       
      })
      .catch(error => console.log(error));
    },
    async getCuentaCapitalDetalle(){
      await socio.getCuentaCapitalDetalle(this.ctaCapital[0].cuenta)
      .then(response => {
        let detalles = response.data;
        this.detalleCta = response.data
      })
      .catch(error => console.log(error));
    }
  },
  computed:{

    userLogged() {
        return auth.getUserLogged();
      },
  },
  async mounted(){
    this.loading = true;
    await this.getCuentaCapital();
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
