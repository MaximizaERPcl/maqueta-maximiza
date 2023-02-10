<template>
  <div>
    <v-dialog
      :value="dialog.state"
      width="950px"
      max-width="950px"
      :fullscreen="$vuetify.breakpoint.xsOnly"
      @click:outside="cerrar()"
    >
      <v-card tile flat>
        <v-toolbar color="primary" dark flat tile>
          <v-toolbar-title class="flex text-center titulo"
            >Saldo a favor - Cuenta N° {{ dialog.data.Cuenta }}</v-toolbar-title
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
                <v-icon color="primary"> mdi-account-details </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Rut</v-list-item-subtitle>
                <v-list-item-title>{{
                  formatterRut(dialog.user.rut)
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary"> mdi-account </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Nombre</v-list-item-subtitle>
                <v-list-item-title>{{
                  conv.capitalizeString(dialog.user.nombre)
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
                  conv.capitalizeString(dialog.data.Producto)
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" sm="12" md="6">
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="primary"> mdi-numeric </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>N° Cuenta</v-list-item-subtitle>
                <v-list-item-title>{{ dialog.data.Cuenta }}</v-list-item-title>
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
                <v-list-item-title>{{ dialog.data.estado }}</v-list-item-title>
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
                <v-list-item-subtitle>Fecha apertura</v-list-item-subtitle>
                <v-list-item-title>{{
                  dialog.data.Fecha_Apertura
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
                <v-list-item-subtitle>Saldo Disponible</v-list-item-subtitle>
                <v-list-item-title>{{
                  conv.formatMonto(this.dialog.data.vistd_m_monto, true)
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider class="hidden-md-and-up" />
          </v-col>
        </v-row>

        <v-card-title class="mt-4">
          <span class="cabecera">Detalles:</span>
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
          <template v-slot:item.monto="{ item }">
            <v-icon v-if="parseInt(item.monto) > 0" color="success" left>
              mdi-arrow-bottom-left
            </v-icon>
            <v-icon v-else color="error" left>mdi-arrow-top-right</v-icon>

            {{ conv.formatMonto(item.monto, true) }}
          </template>
          <template v-slot:item.saldo="{ item }">
            {{ conv.formatMonto(item.saldo, true) }}
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
import pdf from "@/services/pdfGenerator";
import { formatterRut } from "chilean-formatter";
import funciones from "@/services/funciones";

export default {
  props: ["dialog"],
  data() {
    return {
      cabeceras: [
        {
          text: "Fecha",
          align: "start",
          sortable: true,
          value: "fecha",
          sort: (a, b) => funciones.compareFn(a, b),
        },
        {
          text: "Tipo",
          align: "start",
          sortable: true,
          value: "tipo",
        },
        {
          text: "Monto",
          align: "start",
          sortable: true,
          value: "monto",
          sort: (a, b) => funciones.compareValue(a, b),
        },
        { text: "Saldo", align: "start", sortable: true, value: "saldo" },
      ],
      detalles: [],
      noData: false,
      search: "",
    };
  },
  computed: {
    conv() {
      return conv;
    },
    formatterRut() {
      return formatterRut;
    },
  },
  methods: {
    cerrar() {
      this.$emit("cerrarDialogo");
    },
    getDetalle() {
      socio
        .getDetalleRemanente(this.dialog.data.Cuenta)
        .then((response) => {
          console.log(response.data);
          if (response.data.length == 0) this.noData = true;
          else {
            this.noData = false;
            this.detalles = response.data;
          }
        })
        .catch((error) => console.log(error));
    },
    exportPDF() {
      pdf.exportToPdfRemanente(
        this.cabeceras,
        this.detalles,
        this.dialog,
        "Saldo a favor - Cuenta N° " + this.dialog.data.Cuenta
      );
    },
  },
  mounted() {
    this.getDetalle();
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
