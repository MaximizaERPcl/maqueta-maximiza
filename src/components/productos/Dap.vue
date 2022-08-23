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
            <v-toolbar-title class="flex text-center">Depósito a Plazo</v-toolbar-title>
          </v-toolbar>
          <v-data-table 
            :headers="cabeceras1"
            :items="daps"
          >
            <template
              v-slot:item.monto_final="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.monto_final) }}
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
    }
  },
  methods:{
    async getDap(){
      await socio.getDap(this.userLogged.id_cliente)
      .then(response => {
        if(response.data)
          this.daps = response.data;
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
    this.getDap()
  }
}
</script>