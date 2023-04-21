<template>
  <v-container class="py-0">
    <v-row justify="center" no-gutters>
      <v-col cols="12">
        <v-card elevation="10" class="darkGlass">
          <v-toolbar
            color="primary"
            dark
            flat
            class="mb-4 primaryGradient"
            tile
            dense
          >
            <v-toolbar-title class="flex text-center titulo"
              >Créditos</v-toolbar-title
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
                :headers="cabecerasCreditos"
                :items="creditos"
                class="mx-4 mb-2 elevation-1"
                group-by="credito"
              >
                <template v-slot:group.header="{ group, items }">
                  <td
                    colspan="10"
                    style="height: 28px !important; background: #f5f5f5"
                  >
                    <span class="grupo">
                      {{
                        /*"Credito: " +*/
                        conv.capitalizeString(
                          items[0].tipo_credito.split(" - ")[1]
                        ) +
                        " Nº" +
                        group
                      }}
                    </span>
                  </td>
                </template>
                <template v-slot:item.valor_cuota="{ item }">
                  {{ conv.formatMonto(item.valor_cuota, true) }}
                </template>
                <template v-slot:item.monto_otorgado="{ item }">
                  {{ conv.formatMonto(item.monto_otorgado, true) }}
                </template>
                <template v-slot:item.tipo_credito="{ item }">
                  {{ conv.capitalizeString(item.tipo_credito.split(" - ")[1]) }}
                </template>
                <template v-slot:item.saldo_capital="{ item }">
                  {{ conv.formatMonto(item.saldo_capital, true) }}
                </template>
                <template v-slot:item.tasa="{ item }">
                  {{ item.tasa + "%" }}
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon @click="mostrarDetalle(item)">
                        <v-icon v-bind="attrs" v-on="on">
                          mdi-magnify-expand
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Ver Más</span>
                  </v-tooltip>
                </template>
                <template v-if="creditos.length > 0" v-slot:body.append>
                  <tr class="hidden-sm-and-up">
                    <td><b>TOTAL</b></td>
                    <td>
                      <b>{{ formatMonto(totalCreditos.monto_otorgado) }}</b>
                    </td>
                  </tr>
                  <tr class="hidden-xs-only">
                    <td><b>TOTAL</b></td>
                    <td>
                      <b>{{ formatMonto(totalCreditos.valor_cuota) }}</b>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <b>{{ formatMonto(totalCreditos.saldo_capital) }}</b>
                    </td>
                    <td>
                      <b>{{ formatMonto(totalCreditos.monto_otorgado) }}</b>
                    </td>
                    <td></td>
                  </tr>
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
                      >Créditos</v-toolbar-title
                    >
                  </v-system-bar>
                </template>
              </v-data-table>

              <v-data-table
                :headers="cabecerasMorosas"
                :items="cuotasMorosas"
                :search="search"
                group-by="credito"
                v-if="cuotasMorosas.length > 0"
                class="mx-4 mb-2 elevation-1"
              >
                <template v-slot:group.header="{ group, items }">
                  <td
                    colspan="10"
                    style="height: 28px !important; background: #f5f5f5"
                  >
                    <span class="grupo">
                      {{
                        /*"Credito: " +*/
                        conv.capitalizeString(
                          items[0].tipo_credito.split(" - ")[1]
                        ) +
                        " Nº" +
                        group
                      }}
                    </span>
                  </td>
                </template>
                <template v-slot:item.tipo_credito="{ item }">
                  {{ conv.capitalizeString(item.tipo_credito.split(" - ")[1]) }}
                </template>
                <template v-slot:item.valor_cuota="{ item }">
                  {{
                    Intl.NumberFormat("es-CL", {
                      currency: "CLP",
                      style: "currency",
                    }).format(item.valor_cuota)
                  }}
                </template>
                <template v-slot:item.mora="{ item }">
                  {{
                    Intl.NumberFormat("es-CL", {
                      currency: "CLP",
                      style: "currency",
                    }).format(item.mora)
                  }}
                </template>
                <template v-slot:item.gasto_cobranza="{ item }">
                  {{
                    Intl.NumberFormat("es-CL", {
                      currency: "CLP",
                      style: "currency",
                    }).format(item.gasto_cobranza)
                  }}
                </template>
                <template v-slot:item.saldo_uota="{ item }">
                  {{
                    Intl.NumberFormat("es-CL", {
                      currency: "CLP",
                      style: "currency",
                    }).format(item.saldo_uota)
                  }}
                </template>
                <template v-slot:item.acumulado="{ item }">
                  {{
                    Intl.NumberFormat("es-CL", {
                      currency: "CLP",
                      style: "currency",
                    }).format(item.acumulado)
                  }}
                </template>
                <template v-slot:item.abonado="{ item }">
                  {{ formatMonto(item.abonado, true) }}
                </template>
                <template v-slot:item.i_pro="{ item }">
                  {{ formatMonto(item.i_pro, true) }}
                </template>

                <template v-slot:body.append>
                  <tr class="hidden-sm-and-up">
                    <td><b>TOTAL</b></td>
                    <td>
                      <b>{{ formatMonto(totalCuotasMorosas.saldo_uota) }}</b>
                    </td>
                  </tr>
                  <tr class="hidden-xs-only">
                    <td><b>TOTAL</b></td>
                    <td></td>
                    <td></td>
                    <td>
                      <b>{{ formatMonto(totalCuotasMorosas.valor_cuota) }}</b>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <b>{{ formatMonto(totalCuotasMorosas.saldo_uota) }}</b>
                    </td>
                  </tr>
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
                      >Cuotas Morosas Deudor</v-toolbar-title
                    >
                  </v-system-bar>
                  <v-card-title>
                    <v-text-field
                      v-model="search"
                      append-icon="mdi-magnify"
                      label="Buscar"
                      single-line
                      hide-details
                      outlined
                      dense
                    ></v-text-field>
                    <v-spacer></v-spacer>
                  </v-card-title>
                </template>
              </v-data-table>

              <v-data-table
                v-if="creditosAvalados.length > 0"
                :headers="cabecerasAvalados"
                :items="creditosAvalados"
                class="mx-4 mb-2 elevation-1"
                no-data-text="No se encontraron créditos avalados"
              >
                <template v-slot:item.rut="{ item }">
                  {{ formatRut(item.rut) }}
                </template>
                <template v-slot:item.creme_f_otorgamiento="{ item }">
                  {{ conv.formatFecha(item.creme_f_otorgamiento) }}
                </template>
                <template v-slot:item.creme_m_valor_cuota="{ item }">
                  {{ conv.formatMonto(item.creme_m_valor_cuota, true) }}
                </template>
                <template v-slot:item.monto="{ item }">
                  ${{ item.monto }}
                </template>
                <template v-slot:item.saldo_credito="{ item }">
                  ${{ item.saldo_credito }}
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
                      >Créditos Avalados</v-toolbar-title
                    >
                  </v-system-bar>
                </template>
              </v-data-table>

              <v-data-table
                v-if="avalesVigentes.length > 0"
                :headers="cabecerasAvales"
                :items="avalesVigentes"
                class="mx-4 mb-2 elevation-1"
                no-data-text="No se encontraron avales para el socio"
              >
                <template v-slot:item.rut_aval="{ item }">
                  {{ formatRut(item.rut_aval) }}
                </template>
                <template v-slot:item.creme_f_otorgamiento="{ item }">
                  {{ conv.formatFecha(item.creme_f_otorgamiento) }}
                </template>
                <template v-slot:item.creme_m_valor_cuota="{ item }">
                  {{ conv.formatMonto(item.creme_m_valor_cuota, true) }}
                </template>
                <template v-slot:item.monto="{ item }">
                  ${{ item.monto }}
                </template>
                <template v-slot:item.saldo_credito="{ item }">
                  ${{ item.saldo_credito }}
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
                      >Avales Vigentes del Socio</v-toolbar-title
                    >
                  </v-system-bar>
                </template>
              </v-data-table>
            </v-container>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <app-detalle
      v-if="dialog.state"
      :dialog="dialog"
      @cerrarDialogo="dialog.state = false"
    ></app-detalle>
  </v-container>
</template>

<script>
import NoDataVue from "../app/NoDataApp.vue";
import auth from "@/auth/auth";
import socio from "@/services/socio";
import DetalleCreditosVue from "./dialogos/DetalleCreditos.vue";
import cabecerasJson from "@/assets/json/cabecerasCredito.json";
import conv from "@/services/conversores";
import { formatterRut } from "chilean-formatter";
import funciones from "@/services/funciones";

export default {
  metaInfo: { titleTemplate: "%s | Créditos" },
  components: {
    "app-no-datos": NoDataVue,
    "app-detalle": DetalleCreditosVue,
  },
  data: function () {
    return {
      cabeceras: cabecerasJson,
      colorCabeceras: "secondary",
      search: "",
      creditos: null,
      cuotasMorosas: [],
      creditosAvalados: [],
      avalesVigentes: [],
      noDatos: false,
      msg: "NO POSEE CRÉDITOS ASOCIADOS",
      dialog: { state: false, data: {}, user: {} },
      totalCuotasMorosas: {},
      totalCreditos: {},
      loading: true,
      user: {},
      cabecerasCreditos: [],
      cabecerasMorosas: [],
      cabecerasAvalados: [],
      cabecerasAvales: [],
    };
  },
  computed: {
    conv() {
      return conv;
    },
    userLogged() {
      return auth.getUserLogged();
    },
  },
  methods: {
    async getDetalleCreditos(accion) {
      await socio
        .getDetalleCreditos(this.userLogged.id_cliente, accion)
        .then((response) => {
          if (accion === 2) {
            this.cuotasMorosas = response.data;
            this.totalCuotasMorosas = response.data[response.data.length - 1];
            this.cuotasMorosas.pop();
          } else if (accion === 3) {
            this.totalCreditos = response.data[response.data.length - 1];

            this.creditos = response.data.filter(
              (credito) => credito.credito !== "0"
            );
            /*if(this.creditos.length == 0)
                this.noDatos = true;
              else
                this.noDatos = false;*/
          } else if (accion == 4 && response.data !== "") {
            this.creditosAvalados = response.data;
          } else if (accion == 5 && response.data !== "") {
            this.avalesVigentes = response.data;
          }
        })
        .catch((error) => console.log(error));
    },
    async mostrarDetalle(item) {
      this.dialog.data = item;
      this.dialog.user = this.userLogged;
      this.dialog.state = true;
    },
    formatRut(value) {
      return formatterRut(value);
    },
    formatMonto(monto) {
      let intMonto = parseInt(parseFloat(monto));
      return Intl.NumberFormat("es-CL", {
        currency: "CLP",
        style: "currency",
      }).format(Math.abs(intMonto));
    },
    initCabeceras() {
      let cabecerasCreditos = this.cabeceras.creditos;
      cabecerasCreditos[4].sort = (a, b) =>
        funciones.compareFn(a, b, "DD/MM/YYYY");

      cabecerasCreditos[5].sort = (a, b) =>
        funciones.compareFn(a, b, "DD/MM/YYYY");
      this.cabecerasCreditos = cabecerasCreditos;

      let cabecerasMorosas = this.cabeceras.morosas;
      cabecerasMorosas[2].sort = (a, b) => funciones.compareFn(a, b);
      this.cabecerasMorosas = cabecerasMorosas;

      let cabecerasAvalados = this.cabeceras.avalados;
      cabecerasAvalados[6].sort = (a, b) => funciones.compareFn(a, b);
      this.cabecerasAvalados = cabecerasAvalados;

      let cabecerasAvales = this.cabeceras.avales;
      cabecerasAvales[5].sort = (a, b) =>
        funciones.compareFn(a, b, "YYYY-MM-DD");
      this.cabecerasAvales = cabecerasAvales;
    },
  },
  async mounted() {
    this.loading = true;

    await auth
      .userInfo(this.userLogged.id_cliente)
      .then(async (response) => {
        let user = response.data[0];
        if (user.creditos != "0") {
          this.noDatos = false;
          this.initCabeceras();
          await this.getDetalleCreditos(3);
          await this.getDetalleCreditos(2);
          await this.getDetalleCreditos(4);
          await this.getDetalleCreditos(5);
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
  line-height: 28px;
  word-break: normal;
}
.grupo {
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
}
</style>
