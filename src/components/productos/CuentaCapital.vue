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
            dense
            flat
            tile
          >
            <v-toolbar-title class="flex text-center">Cuenta Capital</v-toolbar-title>
          </v-toolbar>
          <v-data-table 
            :headers="cabeceras1"
            :items="ctaCapital"
            class="mx-4 mb-2 elevation-1"
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

            <template v-slot:top>
              <v-toolbar
              flat
              outlined
              dense             
              >
                <v-toolbar-title class="flex text-center">Detalle Cuenta Capital</v-toolbar-title>
              </v-toolbar>
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
          value: 'cuotas' 
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
          value: 'tipo' 
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
      ctaCapital: [{
        producto: 'Capital Social',
        vigente: 'Si',
        cuotas:57,
        saldo:39783
      }],

      detalleCta: [
        { fecha: '02/05/2022',
          tipo: 'Abono de reajustes',
          monto:1618,
          saldo:39783
        },
        { fecha: '01/01/2022',
          tipo: 'Cargo por Remanente Negativo',
          monto:-681,
          saldo:37321
        },
        { fecha: '01/01/2022',
          tipo: 'Ajuste Monetario Cap',
          monto:844,
          saldo:38165
        },
        { fecha: '31/12/2021',
          tipo: 'Abono de reajustes',
          monto:37321,
          saldo:38002
        }
      ]
    }
  },

  computed:{
    ...mapState(['rutaActual'])
  }
}
</script>