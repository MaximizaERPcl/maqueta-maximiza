<template>
  <v-container class="py-0">
    <v-row justify="center">
      <v-col cols="11">
        <v-card elevation="10">
          <v-toolbar
            color="primary"
            dark
            flat
            tile
            class="mb-4 primaryGradient"
          >
            <v-toolbar-title class="flex text-center titulo"
              >Depósito a Plazo</v-toolbar-title
            >
          </v-toolbar>
          <v-row
            class="fill-height mb-4"
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
                :headers="cabeceraGeneral"
                :items="daps"
                class="elevation-1"
              >
                <template v-slot:item.producto="{ item }">
                  {{ conv.capitalizeString(item.producto) }}
                </template>
                <template v-slot:item.oficina="{ item }">
                  {{ conv.capitalizeString(item.oficina) }}
                </template>
                <template v-slot:item.monto_final="{ item }">
                  {{ conv.formatMonto(item.monto_final, true) }}
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn @click="mostrarDetalle(item)" icon>
                        <v-icon v-bind="attrs" v-on="on">
                          mdi-magnify-expand
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Ver Detalle</span>
                  </v-tooltip>
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
import auth from "@/auth/auth";
import socio from "@/services/socio";
import NoDataVue from "../app/NoDataApp.vue";
import DetalleDapVue from "./dialogos/DetalleDap.vue";
import conv from "@/services/conversores";
import cabecerasDap from "@/assets/json/cabecerasDap.json";
import funciones from "@/services/funciones";

export default {
  metaInfo: { titleTemplate: "%s | Depósito a Plazo" },
  components: {
    "app-no-datos": NoDataVue,
    "app-detalle": DetalleDapVue,
  },
  data: function () {
    return {
      cabeceras: cabecerasDap,
      cabeceraGeneral: [],
      daps: [],
      noDatos: false,
      msg: "NO POSEE DEPÓSITOS A LARGO PLAZO ASOCIADOS",
      dialog: { state: false, data: {}, user: {} },
      loading: true,
    };
  },
  methods: {
    async getDap() {
      await socio
        .getDap(this.userLogged.id_cliente)
        .then((response) => {
          this.daps = response.data;
        })
        .catch((error) => console.log(error));
    },
    mostrarDetalle(item) {
      this.dialog.data = item;
      this.dialog.user = this.userLogged;
      this.dialog.state = true;
    },
    initCabecera() {
      let cabeceraGeneral = cabecerasDap.general;
      cabeceraGeneral[5].sort = (a, b) =>
        funciones.compareFn(a, b, "DD/MM/YYYY");

      cabeceraGeneral[6].sort = (a, b) =>
        funciones.compareFn(a, b, "DD/MM/YYYY");

      this.cabeceraGeneral = cabeceraGeneral;
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
    if (this.userLogged.info.dap != "0") {
      this.noDatos = false;
      this.initCabecera();
      await this.getDap();
    } else this.noDatos = true;

    this.loading = false;
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
  color: white;
  font-weight: 300;
  font-size: 22px;
  line-height: 22px;
}
</style>
