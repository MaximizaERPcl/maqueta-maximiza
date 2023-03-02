<template>
  <v-container class="py-0">
    <v-row justify="center">
      <v-col cols="12">
        <v-card elevation="10" v-if="!token_ws_returned" class="darkGlass">
          <v-toolbar
            color="primary"
            dark
            dense
            flat
            tile
            class="mb-4 primaryGradient"
          >
            <v-toolbar-title class="flex text-center titulo"
              >Pago de productos</v-toolbar-title
            >
          </v-toolbar>
          <div v-if="userBits.b_pago === '0'">
            <app-no-datos
              v-bind:msg="'En estos momentos el sistema se encuentra ejecutando procesos nocturnos, por favor intente más tarde'"
            ></app-no-datos>
          </div>
          <div v-else>
            <v-row
              v-if="loading"
              class="fill-height mb-4"
              align-content="center"
              justify="center"
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
              <app-no-datos
                v-if="noPago"
                v-bind:msg="/*userLogged.msg_nopago*/ noPagoMsg"
              ></app-no-datos>

              <v-container v-else>
                <v-row dense>
                  <v-col cols="12" md="8">
                    <!-- -----------------------Pago Capital ----------------------------------->
                    <c_capital :capital="pagos.capital" />
                    <!-- ------------------------ Pago creditos -------------------------- -->
                    <c_credito
                      v-if="
                        pagos.credito.length > 0 &&
                        userBits.b_pago_credito === '1'
                      "
                      :creditos="pagos.credito"
                    />
                    <!---------------------- Pago creditos castigados---------------------------->
                    <c_credito_castigado
                      v-if="
                        pagos.credito_castigado.length > 0 &&
                        userBits.b_pago_credito === '1'
                      "
                      :castigados="pagos.credito_castigado"
                    />

                    <!-- -----------------------Pago Capital ----------------------------------->
                    <c_libretas
                      v-if="pagos.libretas.length > 0"
                      :libretas="pagos.libretas"
                    />
                    <!---------------------- Pago comisión creditos---------------------------->
                    <c_comision
                      v-if="pagos.comision_credito.length > 0"
                      :comision_credito="pagos.comision_credito"
                    />
                    <v-alert
                      dismissible
                      type="warning"
                      dense
                      class="mx-1 mb-1"
                      width="auto"
                    >
                      Si posee créditos en estado de renegociación estos no
                      estarán disponibles para el pago en línea.
                    </v-alert>
                  </v-col>
                  <!---------------------------------Calculo Totales --------------------------------->
                  <c_total_pagar
                    :pagos="pagos"
                    :selectedComCre="selectedComCre"
                    :url_pago="url_pago"
                    :loadingPago="loadingPago"
                    :token="token"
                    @pagar="pagar"
                  />
                </v-row>
              </v-container>
            </div>
          </div>
        </v-card>
        <pago-resultado
          v-else
          :token="token_ws_returned"
          :type="type_returned"
          @return="returnPago"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import auth from "@/auth/auth";
import pago from "@/services/pago";
import conv from "@/services/conversores";
import { mapActions, mapState } from "vuex";
import PagoResultVue from "./PagoResult.vue";
import NoDataVue from "../app/NoDataApp.vue";

import c_capital from "./c_capital.vue";
import c_credito from "./c_credito.vue";
import c_credito_castigado from "./c_credito_castigado.vue";
import c_comision from "./c_comision.vue";
import c_total_pagar from "./c_total_pagar.vue";
import c_libretas from "./c_libretas.vue";

export default {
  components: {
    "pago-resultado": PagoResultVue,
    "app-no-datos": NoDataVue,
    c_capital: c_capital,
    c_credito: c_credito,
    c_credito_castigado: c_credito_castigado,
    c_comision: c_comision,
    c_total_pagar: c_total_pagar,
    c_libretas: c_libretas,
  },
  data() {
    return {
      pagos: null,
      prePago: null,
      loadingPago: false,
      noPago: false,
      noPagoMsg: "",
      token: "",
      token_ws_returned: "",
      type_returned: "",
      url_pago: "",
      returl_url: "",
      total: 0,
      selected: [],
      selectedCastigados: [],
      selectedAhorro: [],
      selectedCapital: [],
      selectedComCre: [],
      retorno_cupon: null,
      totales: [
        { tipo: "Cuotas", monto: 0 },
        { tipo: "Castigado", monto: 0 },
        { tipo: "Abono Capital", monto: 0 },
        { tipo: "Cargo por Tarjeta de Crédito", monto: 0 },
        { tipo: "Cargo por servicio", monto: 0 },
      ],
      loading: true,
    };
  },
  methods: {
    ...mapActions(["mostrarAlerta", "close_timeout", "set_timeout"]),
    async getInfoProductos() {
      let data = {
        rut: this.userLogged.rut,
        web_token: this.userLogged.token,
      };
      await pago
        .info_producto(data)
        .then((response) => {
          let data = response.data;
          if (data.codigo === "1") this.pagos = response.data;
          else {
            this.mostrarAlerta({
              mensaje: data.msg,
              color: "error",
              mostrar: true,
            });
            this.noPago = true;
            this.noPagoMsg =
              "No se ha podido obtener la información de los productos a pagar.";
          }
        })
        .catch((error) => console.log(error));
    },
    async getTokenTB() {
      await pago
        .obtener_token_tb(this.prePago)
        .then(async (response) => {
          let data = response.data;
          this.token = await data.token;
          this.url_pago = await data.url;
        })
        .catch((error) => console.log(error));
    },
    async getTokenFlow(correo) {
      let url_pago =
        process.env.NODE_ENV === "production"
          ? window.location.protocol +
            "//" +
            window.location.host +
            process.env.VUE_APP_API_URL_PAGO
          : process.env.VUE_APP_API_URL_PAGO;
      let data = {
        subject: "Pago de productos Maximiza",
        amount: this.total,
        email: correo,
        commerceOrder: this.retorno_cupon.id_pago,
        urlConfirmation: url_pago + "flow_confirmar_pago",
        urlReturn: url_pago + "flow_redirect_result",
        optional: JSON.stringify({
          rut: this.userLogged.rut,
          origen: this.returl_url,
        }),
      };
      await pago
        .flow_obtener_token(data)
        .then(async (response) => {
          let data = response.data;
          this.token = await data.token;
          this.url_pago = await data.url;
        })
        .catch((error) => console.log(error));
    },
    async generarCuponPago(type) {
      let credito = [];
      let libreta = [];
      let castigado = [];
      let capital = [];
      let comCre = [];
      credito = this.selected.map((item) => ({
        credito: item.credito,
        monto: item.monto,
      }));
      castigado = this.selectedCastigados.map((item) => ({
        credito: item.credito,
        monto: item.valor_cuota,
      }));

      libreta = this.selectedAhorro.map((item) => ({
        cuenta: item.id_libreta,
        monto: item.monto,
      }));

      capital = this.selectedCapital.map((item) => ({
        abono_pactado: item.abono_pactado,
      }));

      comCre = this.selectedComCre.map((item) => ({
        monto: item.monto,
        producto: item.producto,
      }));

      credito = credito.concat(castigado);

      if (capital.length == 0) capital.push({ abono_pactado: 0 });

      let finalObject = {
        web_token: this.userLogged.token,
        rut: this.userLogged.rut,
        tipo: type,
        producto_pagar: {
          credito: credito,
          capital: capital[0],
          comision_cre: comCre[0],
          libreta: libreta,
        },
        monto_pagar: this.total,
      };
      let payload = {};
      await pago
        .generar_pago(finalObject)
        .then((response) => {
          let data = response.data[0];
          this.retorno_cupon = data;
          if (data.codigo === "1") {
            this.returl_url =
              window.location.origin + process.env.BASE_URL + "pago-web";
            this.prePago = {
              buy_order: data.id_pago,
              session_id: this.userLogged.token,
              amount: data.monto_pagar,
              return_url: this.returl_url,
            };
            payload = {
              mensaje:
                data.msg +
                ". Será redirigido a " +
                (type == 1
                  ? "Transbank"
                  : "Flow" + " para completar la transacción"),
              color: "success",
              mostrar: true,
            };
          } else {
            payload = {
              mensaje: data.msg,
              color: "error",
              mostrar: true,
            };
          }
        })
        .catch((error) => {
          console.log(error);
          this.loadingPago = false;
        })
        .finally(() => {
          this.mostrarAlerta(payload);
        });
    },

    async pagar(type, correo) {
      this.loadingPago = true;
      await this.generarCuponPago(type);

      if (this.retorno_cupon.codigo === "1") {
        if (type == 1) {
          await this.getTokenTB();
          await document.getElementById("pago_form").submit();
        } else {
          await this.getTokenFlow(correo);
          await document.getElementById("pago_form").submit();
        }
      }
      this.loadingPago = false;
    },
    async init() {
      this.loading = true;

      await this.getInfoProductos();
      this.loading = false;
      if (this.verifyData) {
        this.noPago = true;
        this.noPagoMsg = "No se han encontrado productos a pagar";
      }

      if (localStorage.getItem("pay_token") != null) {
        this.close_timeout();
        this.token_ws_returned = localStorage.getItem("pay_token");
        this.type_returned = localStorage.getItem("pay_type");
        localStorage.removeItem("pay_token");
        localStorage.removeItem("pay_type");
      } else if (localStorage.getItem("cancel_pay") != null) {
        let cancel_pay = JSON.parse(localStorage.getItem("cancel_pay"));
        let payload = {};
        if (cancel_pay.TBK_TOKEN) {
          payload = {
            mensaje: "Pago anulado: Se ha cancelado el pago de los productos",
            color: "error",
            mostrar: true,
          };
        } else {
          payload = {
            mensaje:
              "Pago cancelado: Se excedió el límite de tiempo para realizar el pago",
            color: "error",
            mostrar: true,
          };
        }
        this.mostrarAlerta(payload);
        localStorage.removeItem("cancel_pay");
      }
    },
    returnPago() {
      this.token_ws_returned = "";
      this.set_timeout();
      this.init();
    },
  },
  computed: {
    ...mapState(["userBits"]),
    conv() {
      return conv;
    },
    userLogged() {
      return auth.getUserLogged();
    },
    verifyData() {
      if (this.pagos) {
        let pagos = this.pagos;
        return (
          pagos.credito.length == 0 &&
          pagos.credito_castigado.length == 0 &&
          pagos.capital.length == 0 &&
          pagos.comision_credito.length == 0
        );
      } else return false;
    },
  },
  async mounted() {
    await this.init();
  },
  watch: {
    "$route.query"(value) {
      if (JSON.stringify(value) === "{}") {
        this.token_ws_returned = null;
      }
      this.init();
    },
  }, //watch
  beforeMount() {
    this.$root.$on("enviarCapital", (data) => {
      this.selectedCapital = data;
    }); //enviarCapital
    this.$root.$on("enviarCredito", (item) => {
      this.selected = item;
    }); //enviarCredito
    this.$root.$on("enviarAhorro", (data) => {
      this.selectedAhorro = data;
    }); //enviarCapital
    this.$root.$on("enviarCastigados", (item) => {
      this.selectedCastigados = item;
    }); //enviarCredito
    this.$root.$on("enviarComision", (item) => {
      this.selectedComCre = item;
    }); //enviarCredito

    this.$root.$on("total", (item) => {
      this.total = item;
    }); //enviarCredito
  },
};
</script>
<style scoped>
.titulo {
  font-size: 3.2vh;
  line-height: 3.5vh;
  word-break: normal;
  font-weight: 300;
}
</style>
