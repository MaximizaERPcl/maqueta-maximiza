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
            dense
            class="mb-4 primaryGradient"
          >
            <v-toolbar-title class="flex text-center titulo"
              >Remanentes</v-toolbar-title
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
              <v-data-table :headers="cabeceras.general" :items="remanentes">
                <template v-slot:item.Producto="{ item }">
                  {{ conv.capitalizeString(item.Producto) }}
                </template>
                <template v-slot:item.vistd_m_monto="{ item }">
                  {{ conv.formatMonto(item.vistd_m_monto, true) }}
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
import DetalleRemanenteVue from "./dialogos/DetalleRemanente.vue";
import conv from "@/services/conversores";
import cabecerasRemanente from "@/assets/json/cabecerasRemanente.json";
import funciones from "@/services/funciones";

export default {
  metaInfo: {
    titleTemplate: "%s | Remanentes",
  },
  components: {
    "app-no-datos": NoDataVue,
    "app-detalle": DetalleRemanenteVue,
  },
  data: function () {
    return {
      cabeceras: cabecerasRemanente,
      cabeceraGeneral: [],
      remanentes: [],
      noDatos: false,
      msg: "NO POSEE REMANENTES ASOCIADOS",
      dialog: { state: false, data: {}, user: {} },
      loading: true,
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
    getRemanentes() {
      socio
        .getRemanentes(this.userLogged.id_cliente)
        .then((response) => {
          if (
            (response.data.length == 1 && response.data[0].Cuenta == 0) ||
            response.data.length == 0
          )
            this.noDatos = true;
          else {
            this.noDatos = false;
            this.remanentes = response.data;
          }
        })
        .catch((error) => console.log(error));
    },
    //funcion para inicializar cabeceras de un remanente
    initCabeceraGeneral() {
      let cabeceraGeneral = this.cabeceras.general;
      cabeceraGeneral[3].sort = (a, b) => funciones.compareFn(a, b);
    },

    mostrarDetalle(item) {
      this.dialog.data = item;
      this.dialog.user = this.userLogged;
      this.dialog.state = true;
    },
  },
  async mounted() {
    this.loading = true;
    await this.getRemanentes();
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
