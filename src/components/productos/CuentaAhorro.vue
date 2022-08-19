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
          >
            <v-toolbar-title class="flex text-center">Cuenta de Ahorro</v-toolbar-title>
          </v-toolbar>

          <v-data-table 
            :headers="cabeceras1"
            :items="ctaCapital"
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

export default {
  data: function() {
    return {
      cabeceras1: [
        { text: 'N° Cuenta',
          align: 'start',
          sortable: true, 
          value: 'numCta' 
        },
        {
          text: 'Producto',
          align: 'start',
          sortable: true,
          value: 'producto',
        },
        { text: 'Fecha Apertura',
          align: 'start',
          sortable: true, 
          value: 'fechAper' 
        },
        { text: 'Saldo',
          align: 'start',
          sortable: true, 
          value: 'saldo' 
        },
         { text: 'Último Abono',
          align: 'start',
          sortable: true, 
          value: 'abono' 
        },
      ],
      ctaCapital: [{
        numCta: '1256',
        producto: 'Crédito xxx',
        fechAper: '02/08/2022',
        saldo:25511,
        abono:'11/02/2023'
      }],
    }
  },

  computed:{
    ...mapState(['rutaActual'])
  }
}
</script>