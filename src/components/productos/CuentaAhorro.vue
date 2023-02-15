<template>
  <v-container class="py-0">
    <v-row justify="center">
      <v-col cols="11">
        <v-card elevation="10" class="darkGlass">
          <v-toolbar
            color="primary"
            dark
            flat
            tile
            class="mb-4 primaryGradient"
            dense
          >
            <v-toolbar-title class="flex text-center titulo"
              >Cuenta de Ahorro</v-toolbar-title
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
              <v-data-table :headers="cabeceras.general" :items="ctaAhorro">
                <template v-slot:item.saldo="{ item }">
                  ${{ item.saldo }}
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
import NoDataVue from "../app/NoDataApp.vue";
import auth from "@/auth/auth";
import socio from "@/services/socio";
import DetalleCtaAhorroVue from "./dialogos/DetalleCtaAhorro.vue";
import conv from "@/services/conversores";
import cabecerasAhorro from "@/assets/json/cabecerasAhorro.json";

export default {
  metaInfo: { titleTemplate: "%s | Cuenta de Ahorro" },
  components: {
    "app-no-datos": NoDataVue,
    "app-detalle": DetalleCtaAhorroVue,
  },
  data: function () {
    return {
      cabeceras: cabecerasAhorro,
      ctaAhorro: [],
      msg: "NO POSEE CUENTAS DE AHORRO ASOCIADAS",
      noDatos: false,
      dialog: { state: false, data: {}, user: {} },
      loading: true,
    };
  },
  methods: {
    async getCuentaAhorro() {
      await socio
        .getLibretas(this.userLogged.id_cliente)
        .then((response) => {
          this.ctaAhorro = response.data;
        })
        .catch((error) => console.log(error));
    },

    mostrarDetalle(item) {
      this.dialog.data = item;
      this.dialog.user = this.userLogged;
      this.dialog.state = true;
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
    await auth
      .userInfo(this.userLogged.id_cliente)
      .then(async (response) => {
        let user = response.data[0];
        if (user.libretas != "0") {
          this.noDatos = false;
          await this.getCuentaAhorro();
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
