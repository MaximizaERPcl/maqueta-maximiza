<template>
  <v-container>
    <v-card elevation="10" class="pb-5">
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
      <v-row v-else dense justify="center">
        <v-col cols="12" v-if="finalResult && !error">
          <v-card-title class="pt-0">
            <span class="font-weight-light">Detalles de la transacción:</span>
          </v-card-title>
          <v-divider></v-divider>

          <v-row no-gutters>
            <v-col cols="12" sm="12" md="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary"> mdi-text-box-search </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Nº de comprobante</v-list-item-subtitle>
                  <v-list-item-title>{{
                    finalResult.comprobante
                  }}</v-list-item-title>
                </v-list-item-content>
                <v-divider class="hidden-sm-and-down" vertical></v-divider>
              </v-list-item>
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12" sm="12" md="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary"> mdi-cash-check </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Monto</v-list-item-subtitle>
                  <v-list-item-title>{{
                    conv.formatMonto(finalResult.monto_pagado, true)
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </v-col>
            <v-col cols="12" sm="12" md="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary"> mdi-calendar </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Fecha</v-list-item-subtitle>
                  <v-list-item-title>{{
                    conv.formatFecha2(finalResult.fecha_pago, "YYYYMMDD")
                  }}</v-list-item-title>
                </v-list-item-content>
                <v-divider class="hidden-sm-and-down" vertical></v-divider>
              </v-list-item>
              <v-divider></v-divider>
            </v-col>

            <v-col cols="12" sm="12" md="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary"> mdi-calendar </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Hora</v-list-item-subtitle>
                  <v-list-item-title>{{
                    finalResult.hora_pago
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </v-col>
          </v-row>
          <v-subheader>Productos pagados</v-subheader>
          <v-row no-gutters>
            <div
              style="width: 100%"
              v-for="(prod, i) in productos_pagados"
              :key="i"
            >
              <v-row no-gutters class="mb-4">
                <v-col cols="12" sm="12" md="6">
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon color="primary"> mdi-briefcase-search </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-subtitle>Producto</v-list-item-subtitle>
                      <v-list-item-title
                        >{{ prod.producto }} Nº
                        {{ prod.numero_producto }}</v-list-item-title
                      >
                    </v-list-item-content>
                    <v-divider class="hidden-sm-and-down" vertical></v-divider>
                  </v-list-item>
                  <v-divider></v-divider>
                </v-col>
                <v-col cols="12" sm="12" md="6">
                  <v-divider></v-divider>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon color="primary"> mdi-cash-check </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-subtitle>Monto pagado</v-list-item-subtitle>
                      <v-list-item-title>{{
                        conv.formatMonto(prod.monto_pagado1, true)
                      }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                </v-col>
                <v-col cols="12" sm="12" md="12" v-if="prod.cuota !== '-'">
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon color="primary"> mdi-cash-plus </v-icon>
                    </v-list-item-icon>

                    <v-list-item-content>
                      <v-list-item-subtitle>Cuota</v-list-item-subtitle>
                      <v-list-item-title>{{ prod.cuota }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider></v-divider>
                </v-col>
              </v-row>
            </div>
          </v-row>
          <v-subheader class="mt-4"
            >Comisión Web por uso de Transbank</v-subheader
          >
          <v-divider></v-divider>
          <v-row no-gutters>
            <v-col cols="12" sm="12" md="6">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon color="primary"> mdi-cash-check </v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-subtitle>Monto pagado</v-list-item-subtitle>
                  <v-list-item-title>{{
                    conv.formatMonto(comision.monto_pagado1, true)
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="11" v-else>
          <v-alert outlined type="error" prominent class="mx-1 mb-1">
            {{ alertMsg }}
          </v-alert>
        </v-col>
      </v-row>
      <v-card-actions v-if="!loading" class="mt-4">
        <v-btn right color="primary" @click="$emit('return')">
          <v-icon left> mdi-arrow-left </v-icon>
          Volver a Pago de Productos
        </v-btn>
        <v-btn
          v-if="!error"
          right
          absolute
          color="primary"
          @click="exportPDF()"
        >
          <v-icon left> mdi-download </v-icon>
          Descargar Comprobante
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
<script>
import pago from "@/services/pago";
import auth from "@/auth/auth";
import pdf from "@/services/pdfGenerator";
import conversores from "@/services/conversores";
import { mapActions } from "vuex";
export default {
  props: {
    token: {
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      error: false,
      alertMsg:
        "Se produjo un fallo al procesar la transacción y el pago de productos no ha podido ser realizado, si el error persiste comuníquese con nuestra cooperativa",
      finalResult: null,
      resultado_tb: null,
      sesion_pago: null,
      web_token: null,
    };
  },
  computed: {
    userLogged() {
      return auth.getUserLogged();
    },
    comision() {
      let pagados = [...this.finalResult.productos_pagados];
      let comision = pagados.find((prod) => prod.numero_producto === "4004");
      return comision;
    },
    productos_pagados() {
      let pagados = [...this.finalResult.productos_pagados];
      let idx = pagados.findIndex((prod) => prod.numero_producto === "4004");
      pagados.splice(idx, 1);
      return pagados;
    },
    conv() {
      return conversores;
    },
  },
  methods: {
    ...mapActions(["mostrarAlerta"]),
    async estadoTransaccion() {
      await pago
        .obtener_estado_tb({ token: this.token })
        .then((response) => {
          console.log("1. Estado Transacción", response.data);
          this.resultado_tb = response.data;
          this.web_token = response.data.session_id;
        })
        .catch((error) => console.log(error));
    },
    async pagarCrono() {
      let detalle_tb = JSON.stringify(this.resultado_tb);
      let form = {
        web_token: this.web_token,
        rut: this.userLogged.rut,
        id_pago: this.resultado_tb.buy_order,
        detalle_transbank: detalle_tb,
        monto_pagado: this.resultado_tb.amount,
        codigo_aut: this.resultado_tb.authorization_code,
        tipo_pago: this.resultado_tb.payment_type_code,
      };
      let payload = {};
      await pago
        .pagar_producto(form)
        .then(async (response) => {
          let data = response.data[0];
          console.log("2. Pagar Producto", data);
          if (data.codigo === "1") {
            payload = {
              mensaje: data.msg,
              color: "success",
              mostrar: true,
            };
            this.mostrarAlerta(payload);
            await this.detallePago();
          } else {
            let alertMsg = this.alertMsg;

            let form_reversar = {
              token: this.token,
              amount: this.resultado_tb.amount,
            };
            await pago
              .reversar_pago(form_reversar)
              .then((response) => {
                console.log("2.1. Anular pago", data);
                let type = response.data.type;
                if (type === "REVERSED") {
                  alertMsg += ". Se ha reversado el pago correctamente";
                } else if (type === "NULLIFIED") {
                  alertMsg += ". Se ha anulado el pago correctamente";
                } else {
                  alertMsg +=
                    ". No se ha podido reversar el pago, comuníquese con su sucursal para verificar la transacción";
                }
              })
              .catch((error) => {
                console.log(error);
                alertMsg +=
                  ". No se ha podido reversar el pago, comuníquese con nuestra cooperativa para verificar la transacción";
              });
            this.alertMsg = alertMsg;
            this.loading = false;
          }
        })
        .catch((error) => {
          console.log(error);
          payload = {
            mensaje:
              "Ha ocurrido un error interno al generar el pago, comuníquese con su sucursal para verificar la transacción",
            color: "error",
            mostrar: true,
          };
          this.mostrarAlerta(payload);
          this.loading = false;
        });
    },
    async detallePago() {
      let form = {
        web_token: this.web_token,
        rut: this.userLogged.rut,
        id_pago: this.resultado_tb.buy_order,
      };
      await pago
        .detalle_pago(form)
        .then((response) => {
          console.log("3. Detalle pago", response.data);
          this.finalResult = response.data;
          this.loading = false;
        })
        .catch((error) => console.log(error) && (this.loading = false));
    },
    exportPDF() {
      let user = this.userLogged;
      let data = {
        nombre: user.nombre,
        rut: user.rut,
        numero_comprobante: this.finalResult.comprobante,
        monto: this.finalResult.monto_pagado,
        fecha: this.finalResult.fecha_pago,
        hora: this.finalResult.hora_pago,
      };
      pdf.exportToPdfComprobantePago(
        data,
        this.comision,
        this.productos_pagados,
        "Comprobande de Pago"
      );
    },
  },
  async mounted() {
    this.loading = true;
    await this.estadoTransaccion();
    if (
      this.resultado_tb.response_code == 0 &&
      this.resultado_tb.status === "AUTHORIZED"
    ) {
      await this.pagarCrono();
    } else {
      this.loading = false;
      this.error = true;
    }
  },
};
</script>
