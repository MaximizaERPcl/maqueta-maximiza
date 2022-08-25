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
            dense
            tile
          >
            <v-toolbar-title class="flex text-center">Cuenta de Ahorro</v-toolbar-title>
          </v-toolbar>

          <v-data-table 
            :headers="cabeceras1"
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
                  <v-btn icon>
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

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import auth from '@/auth/auth';
import socio from '@/services/socio';

export default {
  data: function() {
    return {
      cabeceras1: [
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
    }
  },
  methods:{
    async getCuentaAhorro(){
      await socio.getLibretas(this.userLogged.id_cliente)
      .then(response => {
        this.ctaAhorro = response.data;
        console.log('cuentas',response.data)
      })
      .catch(error => console.log(error));
    },
  },

  computed:{
    ...mapState(['rutaActual']),
    userLogged() {
      return auth.getUserLogged();
    },
  },
  mounted(){
    this.getCuentaAhorro()
  }
}
</script>