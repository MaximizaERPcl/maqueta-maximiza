<template>
  <div>
    <v-dialog
      :value="dialog.state"
      width="950px"
      max-width="950px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      @click:outside="cerrar()"
    >
      <v-card tile flat v-if="credito != null">
        <v-toolbar color="primary" dark flat tile>
          <v-toolbar-title class="flex text-center titulo"
            >Crédito N° {{ dialog.data.credito }}</v-toolbar-title
          >
        </v-toolbar>
        <v-card-title>
          <span class="cabecera">Datos del producto:</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-row no-gutters>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary"> mdi-account </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Nombre</v-list-item-subtitle>
                <v-list-item-title>{{ dialog.user.nombre }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary"> mdi-account-details </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Rut</v-list-item-subtitle>
                <v-list-item-title>{{
                  formatRut(dialog.user.rut)
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>

          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary"> mdi-briefcase-account </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Producto</v-list-item-subtitle>
                <v-list-item-title>{{
                  credito.tipo_credito
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary"> mdi-briefcase-search </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Estado</v-list-item-subtitle>
                <v-list-item-title>{{ credito.estado }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary"> mdi-calendar-start </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Fecha Otorgamiento</v-list-item-subtitle>
                <v-list-item-title>{{
                  credito.fecha_otorgamiento
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary"> mdi-cash-plus </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Monto Solicitado</v-list-item-subtitle>
                <v-list-item-title>{{
                  conv.formatMonto(credito.capital, true)
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>

          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary"> mdi-currency-usd </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Valor cuota</v-list-item-subtitle>
                <v-list-item-title>{{
                  conv.formatMonto(credito.valor_cuota, true)
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary"> mdi-percent-circle </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>N° de cuotas</v-list-item-subtitle>
                <v-list-item-title>{{ credito.cuotas }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary"> mdi-percent-circle </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Tasa de Interés</v-list-item-subtitle>
                <v-list-item-title>{{
                  conv.formatPorcentaje(credito.tasa)
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary"> mdi-cash </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>N° Pagaré</v-list-item-subtitle>
                <v-list-item-title>{{ credito.credito }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary"> mdi-cash </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Total prepago</v-list-item-subtitle>
                <v-list-item-title>{{
                  conv.formatMonto(credito.saldo, true)
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="hidden-md-and-up" />
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary"> mdi-percent-circle </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>CAE</v-list-item-subtitle>
                <v-list-item-title>{{
                  conv.formatPorcentaje(credito.cae)
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="hidden-md-and-up" />
          </v-col>
        </v-row>

        <v-card-title class="mt-4">
          <span class="cabecera">Detalles de amortización:</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-title>
          <v-spacer class="hidden-sm-and-down" />
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
          :loading="cargandoTabla"
          :search="search"
        >
          <template v-slot:item.valor_cuota="{ item }">
            {{ conv.formatMonto(item.valor_cuota, true) }}
          </template>

          <template v-slot:item.pagado="{ item }">
            {{ conv.formatMonto(item.pagado, true) }}
          </template>

          <template v-slot:item.total_a_pagar="{ item }">
            {{ conv.formatMonto(item.total_a_pagar, true) }}
          </template>
        </v-data-table>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="mx-2 my-2" @click="exportPDF()">
            <v-icon left>mdi-download</v-icon>
            Descargar PDF
          </v-btn>
          <v-btn color="error" @click="cerrar()">
            <v-icon left>mdi-window-close</v-icon>
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import socio from "@/services/socio";
import conv from "@/services/conversores";
import { formatterRut } from "chilean-formatter";
import pdf from "@/services/pdfGenerator";
import funciones from "@/services/funciones";

export default {
  props: ["dialog"],
  data() {
    return {
      cabeceras: [
        { text: "Cuota", align: "start", sortable: true, value: "nro_cuota" },
        {
          text: "Fecha Vencimiento",
          align: "start",
          sortable: true,
          value: "fecha_venc",
          sort: (a, b) => funciones.compareFn(a, b),
        },
        { text: "Estado", align: "start", sortable: true, value: "estado" },
        {
          text: "Valor Cuota",
          align: "start",
          sortable: true,
          value: "valor_cuota",
        },
        { text: "Pagado", align: "start", sortable: true, value: "pagado" },
        {
          text: "Saldo",
          align: "start",
          sortable: true,
          value: "total_a_pagar",
        },
      ],
      credito: null,
      detalles: [],
      noData: false,
      cargandoTabla: false,
      search: "",
    };
  },
  computed: {
    conv() {
      return conv;
    },
  },
  methods: {
    cerrar() {
      this.$emit("cerrarDialogo");
    },
    formatRut(rut) {
      return formatterRut(rut);
    },
    async getSocioCredito() {
      let form = {
        clien_s_id: this.dialog.user.id_cliente,
        creme_s_id: this.dialog.data.credito,
      };
      await socio
        .getCreditos(form)
        .then((response) => {
          this.credito = response.data[0];
          console.log(this.credito);
        })
        .catch((error) => console.log(error));
    },
    async getDetalle() {
      await socio
        .getProximoPago(this.dialog.data.credito)
        .then((response) => {
          this.cargandoTabla = true;
          if (response.data.length == 0) this.noData = true;
          else {
            this.noData = false;
            this.detalles = response.data;
          }
          this.cargandoTabla = false;
        })
        .catch((error) => console.log(error));
    },
    exportPDF() {
      let dialog = JSON.parse(JSON.stringify(this.dialog));
      dialog.credito = this.credito;
      pdf.exportToPdfCredito(
        this.cabeceras,
        this.detalles,
        dialog,
        "Crédito N° " + this.dialog.data.credito
      );
    },
  },
  async mounted() {
    await this.getSocioCredito();
    await this.getDetalle();
  },
};
</script>

<style scoped lang="css">
.titulo {
  font-size: 30px;
  line-height: 30px;
  word-break: normal;
  font-weight: 300;
}
.cabecera {
  color: black;
  font-weight: 300;
  font-size: 22px;
  line-height: 22px;
}
</style>
