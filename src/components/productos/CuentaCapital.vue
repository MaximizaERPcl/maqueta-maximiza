<template>
  <v-container class="py-0">
    <v-row justify="center" no-gutters>
      <v-col cols="11">
        <v-card elevation="10" class="darkGlass">
          <v-toolbar
            color="primary"
            dark
            flat
            tile
            dense
            class="mb-4 primaryGradient"
          >
            <v-toolbar-title class="flex text-center titulo"
              >Cuenta Capital</v-toolbar-title
            >
          </v-toolbar>
          <v-row
            class="mb-4"
            align-content="center"
            justify="center"
            v-if="loading"
          >
            <v-col class="text-subtitle-1 text-center" cols="12">
              Cargando Datos
            </v-col>
            <v-col cols="6">
              <v-progress-linear
                color="primary"
                indeterminate
                rounded
                height="10"
              ></v-progress-linear>
            </v-col>
          </v-row>
          <div v-else>
            <app-no-datos v-if="noDatos" v-bind:msg="msg"></app-no-datos>
            <v-container v-else>
              <v-data-table
                :headers="cabecerasGeneral"
                :items="ctaCapital"
                class="mx-4 mb-4 elevation-1"
              >
                <template v-slot:item.saldo="{ item }">
                  {{ conv.formatMonto(item.saldo, true) }}
                </template>
                <template v-slot:item.cuota_participacion="{ item }">
                  {{ Math.round(item.cuota_participacion) }}
                </template>

                <template v-slot:item.actions="{}">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        @click="exportPDF()"
                        :disabled="loadingDetalle"
                      >
                        <v-icon v-bind="attrs" v-on="on">
                          mdi-file-download
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Descargar Cartola</span>
                  </v-tooltip>
                </template>
              </v-data-table>

              <v-data-table
                :headers="cabecerasDetalle"
                :items="detalleCta"
                class="mx-4 mb-2 elevation-1"
              >
                <template v-slot:item.saldo="{ item }">
                  {{ conv.formatMonto(item.saldo, true) }}
                </template>
                <template v-slot:item.monto="{ item }">
                  <v-icon v-if="parseInt(item.monto) > 0" color="success" left>
                    mdi-arrow-bottom-left
                  </v-icon>
                  <v-icon v-else color="error" left>mdi-arrow-top-right</v-icon>

                  {{ conv.formatMonto(item.monto, true) }}
                </template>

                <template v-slot:top>
                  <v-system-bar
                    flat
                    outlined
                    dense
                    :color="colorCabeceras"
                    height="40"
                  >
                    <v-toolbar-title class="flex text-center cabecera"
                      >Detalle Cuenta Capital</v-toolbar-title
                    >
                  </v-system-bar>
                </template>
              </v-data-table>
            </v-container>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import socio from "@/services/socio";
import auth from "@/auth/auth";
import cabecerasCapitalJson from "@/assets/json/cabecerasCapital.json";
import NoDataVue from "../app/NoDataApp.vue";
import conv from "@/services/conversores";
import funciones from "@/services/funciones";
import pdf from "@/services/pdfGenerator";

export default {
  metaInfo: { titleTemplate: "%s | Cuenta Capital" },
  components: {
    "app-no-datos": NoDataVue,
  },
  data: function () {
    return {
      cabeceras: cabecerasCapitalJson,
      cabecerasDetalle: [],
      cabecerasGeneral: [],
      colorCabeceras: "secondary",
      ctaCapital: [],

      detalleCta: [],
      cuenta_capital: {},
      noDatos: true,
      msg: "NO POSEE CUENTAS CAPITALES ASOCIADAS",
      loading: true,
      loadingDetalle: true,
    };
  },
  methods: {
    async getCuentaCapital() {
      await socio
        .getCuentaCapital(this.userLogged.rut)
        .then((response) => {
          if (response.data !== "") {
            if (response.data.length == 0 || response.data[0].vigente === "NO")
              this.noDatos = true;
            else {
              this.noDatos = false;
              this.ctaCapital = response.data;
              this.getCuentaCapitalDetalle();
            }
          } else this.noDatos = true;
        })
        .catch((error) => console.log(error));
    },
    async getCuentaCapitalDetalle() {
      this.loadingDetalle = true;
      await socio
        .getCuentaCapitalDetalle(this.ctaCapital[0].cuenta)
        .then((response) => {
          if (response.data) this.detalleCta = response.data;
          this.loadingDetalle = false;
        })
        .catch((error) => console.log(error));
    },
    exportPDF() {
      let cabeceras = [
        { text: "Fecha", value: "fecha" },
        {
          text: "Sucursal",
          value: "sucursal",
        },
        { text: "Tipo Pago", value: "tipo_pago" },
        { text: "Tipo", value: "tipo_mov" },
        { text: "Monto", value: "monto" },
        { text: "Saldo", value: "saldo" },
      ];
      let user = this.userLogged;
      let data = {
        nombre: user.nombre,
        rut: user.rut,
        institucion: user.institucion,
        monto_abono: this.ctaCapital[0].abono_pactado,
        cuota_social: this.ctaCapital[0].cuota_participacion,
        forma_pago: this.ctaCapital[0].forma_pago,
        abono_inicial: this.ctaCapital[0].abono_inicial,
      };
      pdf.exportToPdfCartolaCapital(
        cabeceras,
        this.detalleCta,
        data,
        "Cuenta Capital N° " + this.ctaCapital[0].cuenta
      );
    },
    initCabeceras() {
      let cabeceraDetalle = this.cabeceras.detalle;
      //Funcion para ordenar fechas correctamente
      cabeceraDetalle[0].sort = (a, b) => funciones.compareFn(a, b);

      //Funcion para ordenar los montos correctamente
      cabeceraDetalle[2].sort = (a, b) => funciones.compareValue(a, b);

      this.cabecerasDetalle = cabeceraDetalle;
      this.cabecerasGeneral = this.cabeceras.general;
    },
  },
  computed: {
    conv() {
      return conv;
    },
    userLogged() {
      return auth.getUserLogged();
    },
  },
  async mounted() {
    this.loading = true;
    //get info user from auth
    await auth
      .userInfo(this.userLogged.id_cliente)
      .then(async (response) => {
        let user = response.data[0];
        if (user.cuenta_capital != "0") {
          this.noDatos = false;
          this.initCabeceras();
          await this.getCuentaCapital();
        } else this.noDatos = true;
      })
      .catch((error) => console.log(error));
    this.loading = false;
  },
};
</script>
<style scoped lang="css">
.cabecera {
  color: white;
  font-weight: 300;
  font-size: 22px;
  line-height: 22px;
}
</style>
