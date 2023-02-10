<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="11">
        <v-card elevation="10">
          <v-toolbar class="primaryGradient" dark flat tile :height="height">
            <v-toolbar-title class="titulo"
              >Bienvenido/a
              <span v-if="user">
                {{ conv.capitalizeString(user.nombre) }}</span
              ></v-toolbar-title
            >
          </v-toolbar>
          <v-alert
            v-if="userLogged.b_castigado === '1'"
            outlined
            type="warning"
            dense
            prominent
            class="mb-0"
          >
            {{ userLogged.msg_castigado }}
          </v-alert>
          <v-toolbar
            color="secondary"
            :class="[userLogged.b_castigado === '1' ? 'mt-0 pt-0' : 'mt-4']"
            dark
            flat
            tile
            height="40px"
          >
            <v-icon left>mdi-account-details</v-icon>
            <v-toolbar-title class="cabecera"
              >Información Personal</v-toolbar-title
            >
          </v-toolbar>

          <v-row
            class="fill-height"
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
            <v-list>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary"> mdi-map-marker </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Dirección</v-list-item-subtitle>
                  <v-list-item-title
                    v-if="
                      user.direccion_particular &&
                      user.direccion_particular.trim().length > 0
                    "
                    >{{
                      conv.capitalizeString(user.direccion_particular)
                    }}</v-list-item-title
                  >
                  <v-list-item-title v-else>No hay registro</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary"> mdi-cellphone </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Celular</v-list-item-subtitle>
                  <v-list-item-title
                    v-if="user.Movil && parseInt(user.Movil.trim()) > 0"
                    >{{ user.Movil }}</v-list-item-title
                  >
                  <v-list-item-title v-else>No hay registro</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary"> mdi-phone </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Teléfono</v-list-item-subtitle>
                  <v-list-item-title
                    v-if="
                      user.telefono_particular &&
                      parseInt(user.telefono_particular.trim()) > 0
                    "
                    >{{ user.telefono_particular }}</v-list-item-title
                  >
                  <v-list-item-title v-else>No hay registro</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary"> mdi-email </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Correo</v-list-item-subtitle>
                  <v-list-item-title
                    v-if="user.email && user.email.trim().length > 0"
                    >{{ user.email }}</v-list-item-title
                  >
                  <v-list-item-title v-else>No hay registro</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="11">
        <v-row justify="center" align="stretch">
          <v-col v-for="product in products" :key="product.type">
            <v-card height="100px" elevation="10">
              <v-toolbar color="secondary" dark flat tile dense height="36px">
                <v-icon left>{{ product.icon }}</v-icon>
                <v-toolbar-title class="cabecera">{{
                  product.type
                }}</v-toolbar-title>
              </v-toolbar>
              <v-card-title class="productos pt-2 pb-0">
                <p class="flex text-center">
                  {{
                    product.status !== "0"
                      ? conv.formatMonto(product.amount, true)
                      : "No posee"
                  }}
                </p>
              </v-card-title>
              <v-card-subtitle
                class="flex text-center"
                v-if="product.status !== '0' && product.type === 'Créditos'"
              >
                Total Adeudado
              </v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <mora-dialog v-if="dialogoMora" />
  </v-container>
</template>
<script>
import auth from "@/auth/auth";
import socio from "@/services/socio";
import conv from "@/services/conversores";
import MoraDialog from "@/components/inicio/MoraDialog.vue";
import { mapState } from "vuex";
export default {
  metaInfo: { title: "Inicio" },
  components: {
    "mora-dialog": MoraDialog,
  },
  data: function () {
    return {
      user: null,
      metaInfo: { title: "Inicio" },
      products: [
        { type: "Créditos", status: "0", amount: 0, icon: "mdi-credit-card" },
        {
          type: "Depósitos a plazo",
          status: "0",
          amount: 0,
          icon: "mdi-bank-transfer-in",
        },
        {
          type: "Cuenta de ahorro",
          status: "0",
          amount: 0,
          icon: "mdi-account-cash",
        },
        { type: "Cuenta capital", status: "0", amount: 0, icon: "mdi-cash" },
      ],
      loading: true,
    };
  },
  methods: {
    async setProductos() {
      if (this.user.creditos !== "0") {
        let form = {
          clien_s_id: this.userLogged.id_cliente,
        };
        await socio
          .getCreditos(form)
          .then((response) => {
            let creditos = response.data;
            if (creditos.length > 0) {
              this.products[0].status = this.user.creditos;
              let montoFinal = 0;
              creditos.forEach((credito) => {
                montoFinal += parseInt(credito.saldo.split(".").join(""));
              });
              this.products[0].amount = montoFinal;
            }
          })
          .catch((error) => console.log(error));
      }

      if (this.user.dap !== "0") {
        await socio
          .getDap(this.userLogged.id_cliente)
          .then((response) => {
            let daps = response.data;
            if (daps.length > 0) {
              this.products[1].status = this.user.dap;
              let montoFinal = 0;
              daps.forEach((dap) => {
                montoFinal += parseInt(dap.monto_final);
              });
              this.products[1].amount = montoFinal;
            }
          })
          .catch((error) => console.log(error));
      }

      if (this.user.libretas !== "0") {
        await socio
          .getLibretas(this.userLogged.id_cliente)
          .then((response) => {
            let libretas = response.data;
            if (libretas.length > 0) {
              this.products[2].status = this.user.libretas;
              let montoFinal = 0;
              libretas.forEach((libreta) => {
                montoFinal += parseInt(libreta.saldo.split(".").join(""));
              });
              this.products[2].amount = montoFinal;
            }
          })
          .catch((error) => console.log(error));
      }
      if (this.user.cuenta_capital !== "0") {
        await socio
          .getCuentaCapital(this.user.rut)
          .then((response) => {
            let cuentas = response.data;
            if (cuentas.length > 0) {
              this.products[3].status = this.user.cuenta_capital;
              let montoFinal = 0;
              cuentas.forEach((cuenta) => {
                montoFinal += parseInt(cuenta.saldo.split(".").join(""));
              });
              this.products[3].amount = montoFinal;
            }
          })
          .catch((error) => console.log(error));
        //traer monto
      }
    },
    async getUserInfo() {
      //get info user from auth
      await auth
        .userInfo(this.userLogged.id_cliente)
        .then((response) => {
          this.user = response.data[0];
          this.setProductos();
        })
        .catch((error) => console.log(error));
    },
  },

  computed: {
    ...mapState(["dialogoMora"]),
    userLogged() {
      return auth.getUserLogged();
    },
    conv() {
      return conv;
    },
    height() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return 150;
        case "sm":
          return 100;
        case "md":
          return 70;
        case "lg":
          return 70;
        case "xl":
          return 70;
        default:
          return 70;
      }
    },
  },
  async mounted() {
    if (process.env.NODE_ENV !== "production") console.log(this.userLogged);
    this.loading = true;
    await this.getUserInfo();
    this.loading = false;
  },
};
</script>

<style scoped lang="css">
.titulo {
  font-size: 3.2vh;
  line-height: 40px;
  word-break: normal;
  font-weight: 300;
  white-space: normal;
}
.cabecera {
  color: white;
  font-weight: 300;
  font-size: 2.5vh;
  line-height: 3vh;
}
.productos {
  color: black;
  font-weight: 300;
  font-size: 2.5vh;
  line-height: 3vh;
}
</style>
