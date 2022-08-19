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
            <v-toolbar-title  class="flex text-center">LEGALE</v-toolbar-title>
          </v-toolbar>

          <v-data-table 
            :headers="cabeceras1"
            :items="legale"
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
          text: 'Nombre',
          align: 'start',
          sortable: true,
          value: 'nombre',
        },
        { text: 'Proceso',
          align: 'start',
          sortable: true, 
          value: 'proceso' 
        },
        { text: 'Estado',
          align: 'start',
          sortable: true, 
          value: 'estado' 
        },
        { text: 'Turno Firmante',
          align: 'start',
          sortable: true, 
          value: 'turnoFirmante' 
        },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      legale:[]
    }
  },

  computed:{
    ...mapState(['rutaActual'])
  }
}
</script>