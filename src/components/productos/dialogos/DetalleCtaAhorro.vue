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
          <v-toolbar-title class="flex text-center titulo">Libreta de ahorro N° {{dialog.data.id_libreta}}</v-toolbar-title>
      </v-toolbar>
        <v-card-title >
          <span class="cabecera">Datos del producto:</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-row no-gutters>
          <v-col cols="5">
            <v-list >
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
                  <v-list-item-title>{{dialog.data.nombre}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary">
                    mdi-percent-circle
                  </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Tasa de interés</v-list-item-subtitle>
                  <v-list-item-title>{{parseFloat(dialog.data.tasa_interes)}}%</v-list-item-title>
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
                  <v-list-item-title>{{dialog.data.f_apertura}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="7  ">
            <v-list >
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
                  <v-list-item-title>{{formatMonto(dialog.data.saldo)}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>

            </v-list>
          </v-col>
        </v-row>
        
        <v-card-title class="mt-4">
          <span class="cabecera">Datos del Convenio:</span>
        </v-card-title>

        <v-list>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="primary">
                mdi-briefcase-search
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-subtitle>Forma de pago</v-list-item-subtitle>
              <v-list-item-title>{{dialog.data.forma_pago}}</v-list-item-title>
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
              <v-list-item-subtitle>Monto abono pactado</v-list-item-subtitle>
              <v-list-item-title>{{formatMonto(dialog.data.abono_pactado)}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-title class="mt-4">
          <span class="cabecera">Detalles de giros y abonos:</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-title>
        <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
            outlined
            dense
          ></v-text-field>
        </v-card-title>
         <v-data-table
          :headers="cabeceras"
          :items="detalles"
          :items-per-page="5"
          :search="search"
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
import App from '@/App.vue';
export default {
    props: ["dialog"],
    data() {
        return {
            cabeceras: [
                { text: "Fecha", align: "start", sortable: true, value: "fecha"
                },
                {
                    text: "Tipo",
                    align: "start",
                    sortable: true,
                    value: "tipo",
                },
                { text: "Monto", align: "start", sortable: true, value: "monto"
                },
                { text: "Saldo", align: "start", sortable: true, value: "saldo"
                },
                { text: "", value: "actions", sortable: false },
            ],
            detalles: [],
            noData: false,
            search:''
        };
    },
    computed: {
        monto() {
            let monto = parseInt(parseFloat(this.dialog.data.vistd_m_monto));
            return Intl.NumberFormat("es-CL", { currency: "CLP", style: "currency" }).format(monto);
        },
    },
    methods: {
        cerrar() {
            this.dialog.state = false;
        },
        getDetalleLibreta() {
            socio.getDetalleLibreta(this.dialog.data.id_libreta)
                .then(response => {
                if (response.data.length == 0)
                    this.noData = true;
                else {
                    this.noData = false;
                    this.detalles = response.data;
                }
            })
                .catch(error => console.log(error));
        },
        formatMonto(monto) {
            let intMonto = parseInt(parseFloat(monto));
            return Intl.NumberFormat("es-CL", { currency: "CLP", style: "currency" }).format(Math.abs(intMonto));
        },
        formatPorcentaje(valor) {
            let porcentaje = parseFloat(valor)+100;
            return porcentaje+'%'
        }
    },
    mounted() {
        this.getDetalleLibreta();
    },
    components: { App }
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