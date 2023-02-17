<template>
  <v-col cols="12" md="4">
    <v-card outlined flat>
      <v-card-title class="cabecera black--text">
        Total a pagar : {{ conv.formatMonto(this.total, true) }}
      </v-card-title>
      <v-divider />
      <div v-if="total > 0">
        <v-card-text>
          <v-simple-table dense>
            <template v-slot:default>
              <tbody>
                <template v-for="(total, i) in totales">
                  <tr :key="i" v-if="total.monto > 0">
                    <td>{{ total.tipo }}</td>
                    <td>
                      {{ conv.formatMonto(total.monto, true) }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
        <v-divider />
        <v-subheader class="mt-2 my-0" style="height: 30px"
          >Seleccione el medio de pago</v-subheader
        >
        <v-card-actions class="ml-4 pa-0">
          <v-radio-group v-model="payType" class="my-0" hide-details>
            <v-radio
              v-for="(pay, i) in payments"
              :key="i"
              :label="pay.tipo"
              :value="pay.value"
              :ripple="false"
            >
              <template v-slot:label>
                <div>
                  <v-img
                    :aspect-ratio="16 / 9"
                    :width="100"
                    contain
                    :src="require('@/assets/' + pay.img)"
                  ></v-img>
                </div>
              </template>
            </v-radio>
          </v-radio-group>
        </v-card-actions>
        <v-card-actions class="mx-4 pa-0" v-if="payType == 2">
          <v-form ref="correo_form" v-model="correo_valid" style="width: 100%">
            <v-text-field
              v-model="correo"
              label="Correo de envío comprobante"
              placeholder="Ingrese su correo"
              required
              :rules="[reglas.required, reglas.email]"
              outlined
              dense
              hide-details="auto"
            >
              <template v-slot:prepend>
                <v-icon left color="primary"> mdi-email </v-icon>
              </template>
            </v-text-field>
          </v-form>
        </v-card-actions>
        <v-card-actions class="justify-center" v-if="payType != 0">
          <form
            :action="url_pago"
            :method="payType == 1 ? 'POST' : 'GET'"
            id="pago_form"
          >
            <input
              ref="token"
              :value="token"
              :name="payType == 1 ? 'token_ws' : 'token'"
              type="hidden"
            />
            <v-btn
              class="ma-2"
              color="success"
              :loading="loadingPago"
              :disabled="
                total == 0 || !validCredito || !validCapital || loadingPago
              "
              @click="pagar()"
            >
              <v-icon left> mdi-credit-card-check </v-icon>
              Pagar Productos
              <template v-slot:loader>
                <span>Redirigiendo </span>
                <v-progress-circular
                  class="ml-2"
                  indeterminate
                  color="grey"
                  size="15"
                  width="3"
                ></v-progress-circular>
              </template>
            </v-btn>
          </form>
        </v-card-actions>
      </div>
      <div v-else>
        <v-card-text>Seleccione los productos que desea pagar </v-card-text>
      </div>
      <v-alert outlined type="warning" dense prominent class="mx-1 mb-1">
        Recuerde realizar pago con tarjeta de débito, de lo contrario se cobrará
        otro cargo por servicio.
      </v-alert>
    </v-card>
  </v-col>
</template>

<script>
import conv from "@/services/conversores";
export default {
  data() {
    return {
      total: 0,

      payType: 1,
      comision: 1,
      correo: "",
      correo_valid: true,
      selectedCapital: [],
      selected: [],
      selectedCastigados: [],
      selectedAhorro: [],
      validCapital: true,
      validCredito: true,
      reglas: {
        required: (value) => !!value || "Campo Requerido.",
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Ingrese un correo válido.";
        },
      },
      totales: [
        { tipo: "Cuotas", monto: 0 },
        { tipo: "Castigado", monto: 0 },
        { tipo: "Abono Capital", monto: 0 },
        { tipo: "Cargo por Tarjeta de Crédito", monto: 0 },
        { tipo: "Cuenta de ahorro", monto: 0 },
        { tipo: "Cargo por servicio", monto: 0 },
      ],
      payments: [
        { tipo: "Transbank", value: 1, img: "pay/tbk.png" },
        { tipo: "Flow", value: 2, img: "pay/flow.svg" },
      ],
    }; //return
  }, //data
  computed: {
    conv() {
      return conv;
    },
  }, //computed
  watch: {
    payType(newValue) {
      if (newValue == 1)
        this.comision = parseFloat(this.pagos.comision_web[0].tbk);
      else this.comision = parseFloat(this.pagos.comision_web[0].flow);
      this.sumAll();
    },
    selected: {
      handler() {
        this.calculateSum("selected", 0, "monto");
      },
      deep: true,
    },
    selectedCastigados: {
      handler() {
        this.calculateSum("selectedCastigados", 1, "valor_cuota");
      },
      deep: true,
    },
    selectedCapital: {
      handler() {
        this.calculateSum("selectedCapital", 2, "abono_pactado");
      },
      deep: true,
    },
    selectedComCre: {
      handler() {
        this.calculateSum("selectedComCre", 3, "monto");
      },
    },
    selectedAhorro: {
      handler() {
        this.calculateSum("selectedAhorro", 4, "monto");
      },
      deep: true,
    },
    total: function () {
      this.$root.$emit("total", this.total);
    },
  }, //watch
  methods: {
    calculateSum(array, idx, value) {
      let tempSuma = 0;
      this[array].forEach((item) => {
        tempSuma += parseInt(item[value]);
      });
      this.totales[idx].monto = tempSuma;
      this.sumAll();
    },
    sumAll() {
      let tempSuma = 0;
      this.totales[5].monto = 0;
      this.totales.forEach((item) => {
        tempSuma += item.monto;
      });
      let totalCom = Math.round(tempSuma / ((100 - this.comision) / 100));
      let cargo = totalCom - tempSuma;
      this.totales[5].monto = cargo;
      this.total = totalCom;
    },
    pagar() {
      if (this.payType == 2) {
        this.$refs.correo_form.validate();
        if (this.correo_valid) {
          this.$emit("pagar", this.payType, this.correo);
        }
      } else this.$emit("pagar", this.payType);
    },
  }, //methods
  props: {
    pagos: null,
    selectedComCre: null,
    loadingPago: null,
    url_pago: null,
    token: null,
  }, //props
  mounted() {
    this.comision = this.pagos.comision_web[0].tbk;
  },
  beforeMount() {
    this.$root.$on("enviarCapital", (data) => {
      this.selectedCapital = data;
    }); //enviarCapital
    this.$root.$on("enviarAhorro", (data) => {
      this.selectedAhorro = data;
    }); //enviarCapital
    this.$root.$on("enviarCredito", (item) => {
      this.selected = item;
    }); //enviarCredit
    this.$root.$on("enviarCastigados", (item) => {
      this.selectedCastigados = item;
    }); //enviarCredito
    this.$root.$on("validCapital", (item) => {
      this.validCapital = item;
    }); //enviarCredito
    this.$root.$on("validCredito", (item) => {
      this.validCredito = item;
    }); //enviarCredito
    this.$root.$on("validCastigados", (item) => {
      this.validCredito = item;
    }); //enviarCredito
  }, //beforeMount
}; //default
</script>
