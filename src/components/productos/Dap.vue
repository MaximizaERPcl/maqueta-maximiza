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
            <v-toolbar-title class="flex text-center">Depósito a Plazo</v-toolbar-title>
          </v-toolbar>
          <v-data-table 
            :headers="cabeceras1"
            :items="daps"
          >
            <template
              v-slot:item.monto="{ item }"
            >
              {{ Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(item.monto) }}
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
        {
          text: 'N° Cuenta',
          align: 'start',
          sortable: true,
          value: 'numCta',
        },
        { text: 'Producto',
          align: 'start',
          sortable: true, 
          value: 'producto' 
        },
        { text: 'Cuotas',
          align: 'start',
          sortable: true, 
          value: 'cuotas' 
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
          value: 'monto' 
        },
        { text: 'Fecha Apertura',
          align: 'start',
          sortable: true, 
          value: 'fechAper' 
        },
        { text: 'Fecha Vencimiento',
          align: 'start',
          sortable: true, 
          value: 'fechVenc' 
        },

        { text: '', value: 'actions', sortable: false },
      ],

      daps: [
        { numCta: 5773,
          producto: 'DAP 90 a 366 días', 
          oficina:'CASA MATRIZ',
          estado: 'Renovado',
          monto: 4243608,
          fechAper: '05/08/2022',
          fechVenc: '04/11/2022',
        },
        { numCta: 5773,
          producto: 'DAP 30 a 89 días', 
          oficina:'CASA MATRIZ',
          estado: 'Renovado',
          monto: 416031,
          fechAper: '01/08/2022',
          fechVenc: '05/09/2022',
        }
      ],
    }
  },

  computed:{
    ...mapState(['rutaActual'])
  }
}
</script>