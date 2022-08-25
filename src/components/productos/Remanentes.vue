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
            <v-toolbar-title class="flex text-center">Remanentes</v-toolbar-title>
          </v-toolbar>

          <v-data-table 
            :headers="cabeceras"
            :items="remanentes"
          >
            <template
              v-slot:item.saldo="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.vistd_m_monto) }}
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
      cabeceras: [
        { text: 'N° Cuenta',
          align: 'start',
          sortable: true, 
          value: 'Cuenta' 
        },
        {
          text: 'Producto',
          align: 'start',
          sortable: true,
          value: 'Producto',
        },
        { text: 'Saldo',
          align: 'start',
          sortable: true, 
          value: 'saldo' 
        },
         { text: 'Último Abono',
          align: 'start',
          sortable: true, 
          value: 'ult_abono' 
        },
        { text: '', value: 'actions', sortable: false },
      ],
      remanentes: [],
    }
  },

  computed:{
    userLogged() {
        return auth.getUserLogged();
      },
  },
  
  methods: {
    getRemanentes(){
      socio.getRemanentes(this.userLogged.id_cliente)
      .then( response => {
        this.remanentes = response.data;
      })
      .catch( error => console.log(error))
    },
  },
  mounted() {
    this.getRemanentes()
  }
}
</script>