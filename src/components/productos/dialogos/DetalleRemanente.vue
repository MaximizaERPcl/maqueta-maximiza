<template>
  <div>
    <v-dialog
      v-model="dialog.state"
      width="800px"
      max-width="800px"
    >
      <v-card
        tile
        flat
      >
        <v-toolbar
          color="primary"
          dark
          flat
          tile
        >
          <v-toolbar-title class="flex text-center titulo">Saldo a favor - Cuenta N° {{dialog.data.Cuenta}}</v-toolbar-title>
      </v-toolbar>
        <v-card-title >
          <span class="cabecera">Datos del producto:</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-row no-gutters>
          <v-col cols="5">
            <v-list two-line>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-account-details
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Rut</v-list-item-subtitle>
                  <v-list-item-title>{{dialog.user.rut}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-briefcase-account
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Producto</v-list-item-subtitle>
                  <v-list-item-title>{{dialog.data.Producto}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-briefcase-search
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Estado</v-list-item-subtitle>
                  <v-list-item-title>{{dialog.data.estado}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-currency-usd
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Saldo Disponible</v-list-item-subtitle>
                  <v-list-item-title>{{monto}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="7  ">
            <v-list two-line>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-account
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Nombre</v-list-item-subtitle>
                  <v-list-item-title>{{dialog.user.nombre}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-numeric
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>N° Cuenta</v-list-item-subtitle>
                  <v-list-item-title>{{dialog.data.Cuenta}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-calendar-start
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Fecha apertura</v-list-item-subtitle>
                  <v-list-item-title>{{dialog.data.Fecha_Apertura}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

            </v-list>
          </v-col>
        </v-row>

        <v-card-title class="mt-4">
          <span class="cabecera">Detalles:</span>
        </v-card-title>
        <v-divider></v-divider>

         <v-data-table
          :headers="cabeceras"
          :items="detalles"
          :items-per-page="5"
        >
         <template
            v-slot:item.monto="{ item }"
          >
            {{ formatMonto(item.monto) }}
          </template>
          <template
            v-slot:item.saldo="{ item }"
          >
            {{ formatMonto(item.saldo) }}
          </template>
        </v-data-table>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              class="mx-2 my-2"
              @click="etapa = 1"
            >
              <v-icon left>mdi-download</v-icon>
                Descargar PDF
            </v-btn>
          <v-btn
            color="error"
            @click="cerrar()"
          >
            <v-icon left>mdi-window-close</v-icon>
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import socio from '@/services/socio';
export default {
  props: ['dialog'],
  data () {
    return {
      cabeceras: [
        { text: 'Fecha',
          align: 'start',
          sortable: true, 
          value: 'fecha' 
        },
        {
          text: 'Tipo',
          align: 'start',
          sortable: true,
          value: 'tipo',
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
        { text: '', value: 'actions', sortable: false },
      ],
      detalles:[],
      noData:false
    }
  },
  computed:{
    monto(){
      let monto = parseInt(parseFloat(this.dialog.data.vistd_m_monto));
      return Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(monto);
    },
  },
  methods: {
    cerrar(){
        this.dialog.state = false;
    },
    getDetalle(){
      socio.getDetalleRemanente(this.dialog.data.Cuenta)
      .then( response => {
        console.log(response.data)
        if(response.data.length == 0)
          this.noData = true;
        else{
          this.noData = false;
          this.detalles = response.data;
        }
      })
      .catch( error => console.log(error))
    },
    formatMonto(monto){
      let intMonto = parseInt(parseFloat(monto));
      return Intl.NumberFormat('es-CL',{currency: 'CLP', style: 'currency'}).format(Math.abs(intMonto));
    }
  },
  mounted(){
    this.getDetalle();
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
  color: black;
  font-weight: 300;
  font-size:  22px;
  line-height : 22px;

}
</style>