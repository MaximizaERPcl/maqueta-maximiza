<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="11" md="10">
        <v-stepper v-model="etapa" vertical>
          <v-stepper-step step="1"> Simular Depósito </v-stepper-step>

          <v-stepper-content step="1">
            <v-card outlined class="py-4 px-4 darkGlass">
              <v-form ref="form" v-model="valid">
                <v-select
                  v-model="formData.producto"
                  placeholder="Seleccionar Producto"
                  :items="productos"
                  :rules="[(v) => !!v || 'Campo requerido']"
                  :menu-props="{ offsetY: true }"
                  item-text="nombre"
                  return-object
                  dense
                  label="Producto"
                  required
                  outlined
                  @change="validarMonto()"
                >
                  <template v-slot:prepend>
                    <v-icon left color="primary">
                      mdi-briefcase-account
                    </v-icon>
                  </template>
                  <template v-slot:item="{ item }">
                    {{ conv.capitalizeString(item.nombre.split(" - ")[1]) }}
                  </template>
                </v-select>

                <v-text-field
                  v-model="formData.monto"
                  ref="amountField"
                  dense
                  label="Monto del depósito"
                  v-mask="currencyMask"
                  :hint="formData.producto !== '' ? ayudaMonto : ''"
                  persistent-hint
                  outlined
                  required
                  :rules="[
                    (v) => !!v || 'Campo requerido',
                    (v) => !!v && revisarMonto(v),
                  ]"
                >
                  <template v-slot:prepend>
                    <v-icon left color="primary"> mdi-currency-usd </v-icon>
                  </template>
                </v-text-field>

                <v-select
                  v-model="formData.plazo"
                  :items="plazos"
                  :rules="[(v) => !!v || 'Campo requerido']"
                  :menu-props="{ offsetY: true }"
                  dense
                  no-data-text="Debe seleccionar un producto para calcular los plazos disponibles"
                  label="Plazo en el que desea invertir"
                  outlined
                  required
                  @click="cargarPlazos()"
                >
                  <template v-slot:prepend>
                    <v-icon left color="primary">
                      mdi-calendar-expand-horizontal
                    </v-icon>
                  </template>
                </v-select>
              </v-form>
              <v-btn color="primary" :disabled="!valid" @click="validate">
                Continuar
              </v-btn>
              <v-btn class="ml-2" color="warning" @click="reset">
                Limpiar
              </v-btn>
            </v-card>
          </v-stepper-content>
          <v-stepper-step step="2" :complete="etapa > 1">
            Resultados
          </v-stepper-step>

          <v-stepper-content step="2">
            <v-card outlined v-if="resultado != null">
              <v-list>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary"> mdi-bank-transfer-in </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle
                      >Tipo de depósito</v-list-item-subtitle
                    >
                    <v-list-item-title>{{
                      formData.producto.nombre
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary">
                      mdi-calendar-expand-horizontal
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>Días Plazo</v-list-item-subtitle>
                    <v-list-item-title>{{
                      resultado.dias_plazo_real + " días"
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary"> mdi-currency-usd </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>Moneda</v-list-item-subtitle>
                    <v-list-item-title>{{
                      resultado.nombre_moneda
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary"> mdi-cash </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle
                      >Valor del Depósito</v-list-item-subtitle
                    >
                    <v-list-item-title>${{ formData.monto }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary"> mdi-percent-circle </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>Tasa</v-list-item-subtitle>
                    <v-list-item-title>{{
                      conv.formatPorcentaje(resultado.tasa_base)
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary"> mdi-cash-fast </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>Interés</v-list-item-subtitle>
                    <v-list-item-title>{{
                      conv.formatMonto(resultado.interes_pactado, true)
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary"> mdi-cash-multiple </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle>Monto Final</v-list-item-subtitle>
                    <v-list-item-title>{{
                      conv.formatMonto(resultado.monto_total, true)
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary"> mdi-calendar-end </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle
                      >Fecha Vencimiento</v-list-item-subtitle
                    >
                    <v-list-item-title>{{
                      conv.formatFecha2(
                        resultado.fecha_vencimiento,
                        "DD-MM-YYYY"
                      )
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-icon>
                    <v-icon color="primary"> mdi-cash-sync </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-subtitle
                      >Tipo de renovación</v-list-item-subtitle
                    >
                    <v-list-item-title>{{ "Automatica" }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-btn
                color="warning"
                @click="
                  etapa = 1;
                  sended = false;
                "
                class="mx-2 my-2"
              >
                <v-icon left>mdi-arrow-left</v-icon>
                Volver
              </v-btn>

              <v-btn color="primary" class="mx-2 my-2" @click="exportToPDF()">
                <v-icon left>mdi-file-download</v-icon>
                Descargar Documento
              </v-btn>

              <v-btn
                color="info"
                class="mx-2 my-2"
                :disabled="sended"
                :loading="loadingEmail"
                @click="sendEmail()"
              >
                <v-icon left>mdi-email</v-icon>
                Enviar Correo
              </v-btn>
            </v-card>
          </v-stepper-content>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import auth from "@/auth/auth";
import simulador from "@/services/simulador";
import conv from "@/services/conversores";
import pdf from "@/services/pdfGenerator";
import { mapActions } from "vuex";

export default {
  metaInfo: { title: "Simulador DAP" },
  data: function () {
    return {
      etapa: 1,
      valid: true,
      sended: false,
      loadingEmail: false,
      hoy: new Date(Date.now()),
      formData: { producto: "", monto: "", plazo: "" },
      plazos: [],
      resultado: null,
      currencyMask: createNumberMask({
        prefix: "",
        includeThousandsSeparator: true,
        allowNegative: false,
        thousandsSeparatorSymbol: ".",
      }),
      productos: [],
    };
  },
  methods: {
    ...mapActions(["mostrarAlerta"]),
    validate() {
      this.$refs.form.validate();
      if (this.valid) {
        this.enviarSimulacion();
        this.etapa = 2;
      }
    },
    reset() {
      this.$refs.form.reset();
    },
    async getProductos() {
      await simulador
        .getProductosDaps(this.userLogged.rut)
        .then((response) => {
          let productos = response.data;
          productos.forEach(async (producto) => {
            await simulador
              .getProductosDapsDetalle(producto.codigo, 2)
              .then((response) => {
                var productoCompleto = Object.assign(
                  {},
                  producto,
                  response.data[0]
                );
                this.productos.push(productoCompleto);
              });
          });
        })
        .catch((error) => console.log(error));
    },
    cargarPlazos() {
      this.plazos = [];
      if (this.formData.producto !== "") {
        let inicio = parseInt(this.formData.producto.dia_plazo_minimo);
        let fin = parseInt(this.formData.producto.dia_plazo_maximo);
        for (let index = inicio; index <= fin; index++) {
          let dias = index;
          dias > 1
            ? this.plazos.push(dias + " días")
            : this.plazos.push(dias + " día");
        }
      }
    },
    revisarMonto(value) {
      if (this.formData.producto !== "") {
        let formatedValue = parseInt(value.split(".").join(""));
        let min = parseInt(this.formData.producto.monto_minimo);
        let max = parseInt(this.formData.producto.monto_maximo);
        if (formatedValue < min)
          return (
            false ||
            "El monto debe ser superior a " + conv.formatMonto(min, true)
          );
        else if (formatedValue > max)
          return (
            false ||
            "El monto debe ser inferior a " + conv.formatMonto(max, true)
          );
        else return true;
      }
      return true;
    },
    validarMonto() {
      this.formData.date = this.formData.producto.fecha_mec;
      if (this.formData.monto !== "") this.$refs.amountField.validate();
    },

    enviarSimulacion() {
      let datosFormulario = this.formData;
      let data = {
        procm_s_id: datosFormulario.producto.codigo,
        dias_plazo: datosFormulario.plazo.split(" ")[0],
        monto_deposito: parseInt(datosFormulario.monto.split(".").join("")),
      };
      simulador
        .simularDap(data)
        .then((response) => {
          console.log(response.data);
          this.resultado = response.data[0];
        })
        .catch((error) => console.log(error));
    },

    exportToPDF() {
      let solicitud = JSON.parse(JSON.stringify(this.formData));
      solicitud.nombre = this.userLogged.nombre;
      solicitud.rut = this.userLogged.rut;
      pdf.exportToPdfSimDAP(solicitud, this.resultado);
    },

    async sendEmail() {
      this.loadingEmail = true;
      let formEmail = {
        accion: "2",
        producto: this.formData.producto.nombre.split(" - ")[1],
        clien_s_id: this.userLogged.id_cliente,
        dap_tipo_deposito: this.formData.producto.nombre,
        dap_dias_plazo: this.resultado.dias_plazo_real,
        dap_moneda: this.resultado.nombre_moneda,
        dap_valor_deposito: this.formData.monto,
        dap_tasa: conv.formatPorcentaje(this.resultado.tasa_base),
        dap_interes: this.resultado.interes_pactado,
        dap_monto_final: this.resultado.monto_total,
        dap_fecha_vencimiento: conv.formatFecha2(
          this.resultado.fecha_vencimiento,
          "DD-MM-YYYY"
        ),
        dap_tipo_renovacion: "Automática",
      };
      let payload = {};
      await simulador
        .enviarCorreo(formEmail)
        .then((response) => {
          let data = response.data[0];
          if (data.codigo === "1") {
            payload = {
              mensaje: data.msg,
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
          console.log(response);
        })
        .catch((error) => console.log(error));
      this.loadingEmail = false;
      this.mostrarAlerta(payload);
      this.sended = true;
    },
  },

  async mounted() {
    this.getProductos();
  },
  computed: {
    computedDateFormattedMomentjs() {
      moment.locale("es");
      return this.date ? moment(this.date).format("D [de] MMMM, YYYY") : "";
    },
    ayudaMonto() {
      let msg = "";
      let min = parseInt(parseFloat(this.formData.producto.monto_minimo));
      let max = parseInt(parseFloat(this.formData.producto.monto_maximo));

      if (max == 0 || max >= 999999999)
        msg =
          "El monto ingresado debe ser superior a " +
          conv.formatMonto(min, true);
      else
        msg =
          "El monto ingresado debe ser superior a " +
          conv.formatMonto(min, true) +
          " e inferior a " +
          conv.formatMonto(max, true);
      return msg;
    },
    conv() {
      return conv;
    },
    userLogged() {
      return auth.getUserLogged();
    },
  },
  watch: {
    menu1: function () {
      if (this.date === "") this.date = this.vencMin;
    },
  },
};
</script>
