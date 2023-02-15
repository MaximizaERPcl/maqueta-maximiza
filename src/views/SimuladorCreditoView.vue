<template>
  <v-container>
    <v-row justify="center">
      <v-col v-if="convenio" cols="12" sm="11" md="10">
        <v-stepper v-model="etapa" vertical>
          <v-stepper-step step="1"> Simular Crédito </v-stepper-step>
          <v-stepper-content step="1">
            <v-card outlined class="py-4 px-4 darkGlass">
              <v-form ref="form" v-model="valid">
                <v-select
                  v-model="formData.producto"
                  placeholder="Seleccionar Producto"
                  :items="productos"
                  :rules="[
                    (v) => !!v || 'Campo requerido',
                    (v) => !!v && puedeSimular(v),
                  ]"
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
                    {{
                      conv.capitalizeString(
                        item.tipo === "Campania"
                          ? item.nombre
                          : item.nombre.split(" - ")[1]
                      )
                    }}
                  </template>
                  <template v-slot:selection="{ item }">
                    {{
                      conv.capitalizeString(
                        item.tipo === "Campania"
                          ? item.nombre
                          : item.nombre.split(" - ")[1]
                      )
                    }}
                  </template>
                </v-select>
                <div v-if="simular">
                  <v-select
                    v-if="
                      userLogged.campanias && userLogged.campanias.length > 0
                    "
                    v-model="formData.campania"
                    placeholder="Seleccionar Campaña"
                    no-data-text="Debe seleccionar un producto para mostrar las campañas disponibles"
                    :items="campanias"
                    :rules="[
                      (v) => !!v || 'Campo requerido',
                      (v) => !!v && puedeSimular(v),
                    ]"
                    :menu-props="{ offsetY: true }"
                    item-text="campania"
                    return-object
                    dense
                    label="Campaña"
                    required
                    outlined
                    @click="cargarCampanias()"
                  >
                    <template v-slot:prepend>
                      <v-icon left color="primary"> mdi-briefcase-plus </v-icon>
                    </template>
                    <template v-slot:item="{ item }">
                      {{ conv.capitalizeString(item.campania) }}
                    </template>
                    <template v-slot:selection="{ item }">
                      {{ conv.capitalizeString(item.campania) }}
                    </template>
                  </v-select>

                  <v-text-field
                    ref="amountField"
                    v-model="formData.monto"
                    dense
                    label="Monto del crédito en pesos"
                    outlined
                    required
                    v-mask="formData.monto ? currencyMask : ''"
                    :hint="formData.producto ? ayudaMonto : ''"
                    persistent-hint
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
                    v-if="!inmediato"
                    v-model="formData.plazo"
                    :items="plazos"
                    :rules="[(v) => !!v || 'Campo requerido']"
                    dense
                    :menu-props="{ offsetY: true }"
                    item-text="text"
                    item-value="value"
                    no-data-text="Debe seleccionar un producto para calcular los plazos disponibles"
                    label="Plazo en el que desea pagar"
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

                  <v-select
                    v-else
                    v-model="formData.plazo"
                    :items="plazosInm"
                    :rules="[(v) => !!v || 'Campo requerido']"
                    dense
                    :menu-props="{ offsetY: true }"
                    item-text="text"
                    item-value="value"
                    no-data-text="Debe seleccionar un producto para calcular los plazos disponibles"
                    label="Plazo en el que desea pagar"
                    outlined
                    required
                    @change="
                      formData.date = sumarDiasFecha(formData.plazo * 30)
                    "
                  >
                    <template v-slot:prepend>
                      <v-icon left color="primary">
                        mdi-calendar-expand-horizontal
                      </v-icon>
                    </template>
                  </v-select>

                  <v-menu
                    v-model="menu1"
                    :close-on-content-click="false"
                    :close-on-click="false"
                    max-width="290"
                    transition="scale-transition"
                    offset-y
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="computedDateFormattedMomentjs"
                        clearable
                        dense
                        :label="
                          inmediato ? 'Vencimiento' : 'Primer Vencimiento'
                        "
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @click:clear="formData.date = null"
                        outlined
                        required
                        :disabled="inmediato"
                        :rules="[(v) => !!v || 'Campo requerido']"
                      >
                        <template v-slot:prepend>
                          <v-icon left color="primary">
                            mdi-calendar-end
                          </v-icon>
                        </template>
                      </v-text-field>
                    </template>
                    <v-date-picker
                      v-model="formData.date"
                      @change="menu1 = false"
                      :min="vencMin"
                      :first-day-of-week="1"
                      elevation="10"
                      locale="es-cl"
                    ></v-date-picker>
                  </v-menu>
                </div>
              </v-form>
              <v-btn color="primary" :disabled="!valid" @click="validate">
                Continuar
              </v-btn>
              <v-btn
                class="ml-2"
                color="warning"
                @click="
                  inmediato = false;
                  simular = true;
                  reset();
                "
              >
                Limpiar
              </v-btn>
            </v-card>
          </v-stepper-content>
          <v-stepper-step step="2" :complete="etapa > 1">
            Resultados
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-row
              class="fill-height mb-4"
              align-content="center"
              justify="center"
              v-if="loadingResultado"
            >
              <v-col class="text-subtitle-1 text-center" cols="12">
                Cargando Resultados
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
              <resultados-simulacion
                v-if="resultado"
                :resultado="resultado"
                :formData="formData"
                :solicita="formData.producto.solicita === '1'"
                @volver="volver()"
              />
            </div>
          </v-stepper-content>
        </v-stepper>
      </v-col>
      <v-col v-else cols="11" class="py-8">
        <v-card height="120px" class="px-12 py-6">
          <v-alert outlined type="warning" dense prominent class="mx-1 mb-1">
            {{ userLogged.msg_institucion }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
import auth from "@/auth/auth";
import simulador from "@/services/simulador"; //Llamados a la API relacionados con el simulador
import conv from "@/services/conversores";
import ResultadosSimulacionVue from "@/components/simuladorCredito/ResultadosSimulacion.vue";
import { mapActions } from "vuex";

export default {
  metaInfo: { title: "Simulador Crédito" },
  components: {
    "resultados-simulacion": ResultadosSimulacionVue,
  },
  data: function () {
    return {
      etapa: 1,
      gasto_fijo: 0,
      valid: true,
      inmediato: false,
      simular: true,
      formData: {
        producto: "",
        monto: "",
        plazo: "",
        pago: "En cooperativa",
        date: "",
        campania: "",
      },
      loadingResultado: false,
      vencMin: "",
      menu1: false,
      plazos: [],
      campanias: [],
      plazosInm: [
        { text: "30 días", value: 1 },
        { text: "60 días", value: 2 },
      ],
      productos: [],
      resultado: null,
      convenio: true,
      currencyMask: createNumberMask({
        prefix: "",
        includeThousandsSeparator: true,
        allowNegative: false,
        thousandsSeparatorSymbol: ".",
      }),
    };
  },
  methods: {
    ...mapActions(["mostrarAlerta"]),
    async volver() {
      await this.getProductos(1);
      this.etapa = 1;
      this.resultado = null;
      this.reset();
    },
    async getProductos(accion, producto) {
      let form = {
        accion: accion,
        rut: this.userLogged.rut,
      };
      if (accion == 2) form.procm_s_id = producto;
      await simulador
        .getProductosCreditos(form)
        .then((response) => {
          console.log(response.data);
          if (accion == 1) this.productos = response.data;
          else {
            this.gasto_fijo = parseInt(response.data[0].gasto_fijo);
            //console.log(this.gasto_fijo);
          }
        })
        .catch((error) => console.log(error));
    },
    validate() {
      this.$refs.form.validate();
      if (this.valid) {
        this.loadingResultado = true;
        this.etapa = 2;
        this.enviarSimulacion();
      }
    },
    sumarDiasFecha(dias) {
      let date = new Date(Date.now());
      let nextMes = date.setDate(date.getDate() + dias);
      return moment(nextMes).format("YYYY-MM-DD");
    },
    reset() {
      this.$refs.form.reset();
    },

    cargarCampanias() {
      if (this.formData.producto) this.campanias = this.set_campanias;
    },
    cargarPlazos() {
      this.plazos = [];
      if (this.formData.producto !== "") {
        let inicio = parseInt(this.formData.producto.concl_n_cuota_minimo);
        let fin = parseInt(this.formData.producto.concl_n_cuota_maximo);
        for (let index = inicio; index <= fin; index++) {
          let meses = index;
          meses > 1
            ? this.plazos.push({ text: meses + " meses", value: meses })
            : this.plazos.push({ text: meses + " mes", value: meses });
        }
      }
    },
    revisarMonto(value) {
      if (this.formData.producto) {
        let formatedValue = parseInt(value.split(".").join(""));
        let min = 0;
        let max = 0;
        if (this.formData.campania && this.formData.campania.id) {
          min = parseInt(this.formData.campania.monto_minimo) + this.gasto_fijo;
          max = parseInt(this.formData.campania.monto_maximo);
        } else {
          min = parseInt(this.formData.producto.monto_minimo);
          max = parseInt(this.formData.producto.monto_maximo);
        }

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
    puedeSimular(value) {
      let min = parseInt(value.monto_minimo);
      let max = parseInt(value.monto_maximo);
      if (min >= max || Math.abs(max - min) < 100000) {
        this.simular = false;
        if (max < 0) max = 0;
        return (
          false ||
          `El monto máximo de simulación que usted tiene permitido para este producto es de ${conv.formatMonto(
            max,
            true
          )}, y el monto mínimo para simular es ${conv.formatMonto(
            min,
            true
          )} el cual no es suficiente para realizar una simulación, por favor intente con otro producto`
        );
      } else {
        this.simular = true;
        return true;
      }
    },
    async validarMonto() {
      if (this.formData.producto) {
        await this.getProductos(2, this.formData.producto.codigo);
        this.inmediato = this.formData.producto.codigo === "601";
        if (!this.inmediato)
          this.formData.date = this.formData.producto.fecha_mec;
        else this.formData.date = "";
        if (this.formData.monto !== "") this.$refs.amountField.validate();
      }
    },
    enviarSimulacion() {
      let datosFormulario = this.formData;
      let f_otorgamiento = moment(new Date(Date.now())).format("DD/MM/YYYY");

      let data = {
        procm_s_id: datosFormulario.producto.codigo,
        campe_s_id: datosFormulario.campania
          ? datosFormulario.campania.id
          : null,
        rut: this.userLogged.rut,
        accion: 1,
        fecha_otorgamiento: f_otorgamiento, //cuando se hizo la simulacion
        primer_vencimiento: conv.formatFecha2(
          datosFormulario.date,
          "YYYY-MM-DD"
        ),
        seguro_desgravamen: 1,
        monto: parseInt(datosFormulario.monto.split(".").join("")),
        monto_solicitado: parseInt(datosFormulario.monto.split(".").join("")),
        cantidad_cuota:
          datosFormulario.producto.codigo !== "601" ? datosFormulario.plazo : 1,
        amortizacion: 1,
      };

      simulador
        .simularCredito(data)
        .then((response) => {
          let result = response.data;
          this.resultado = result[0];
          this.loadingResultado = false;
        })
        .catch((error) => console.log(error));
    },
  },

  async mounted() {
    if (this.userLogged.institucion) {
      this.convenio = true;
      await this.getProductos(1);
      if (this.$route.params.preSelect) {
        let preselect = this.$route.params.preSelect;
        let index = this.productos.findIndex((prod) => prod.id === preselect);
        if (index >= 0) this.formData.producto = this.productos[index];
        else this.$router.replace("/simulador-creditos");
      }
      this.vencMin = this.sumarDiasFecha(30);
    } else this.convenio = false;
  },
  computed: {
    set_campanias() {
      let sin_campania = {
        campania: "Sin Campaña",
        descripcin: "",
        fecha_disponible: "",
        id: null,
      };
      let campania = this.userLogged.campanias;
      campania.unshift(sin_campania);
      return campania;
    },
    computedDateFormattedMomentjs() {
      moment.locale("es");
      return this.formData.date
        ? moment(this.formData.date).format("D [de] MMMM, YYYY")
        : "";
    },
    ayudaMonto() {
      let msg = "";
      let min = 0;
      let max = 0;

      if (this.formData.campania && this.formData.campania.id) {
        min = parseInt(this.formData.campania.monto_minimo) + this.gasto_fijo;
        max = parseInt(this.formData.campania.monto_maximo);
      } else {
        min = parseInt(this.formData.producto.monto_minimo);
        max = parseInt(this.formData.producto.monto_maximo);
      }

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
      if (this.formData.date === "") this.formData.date = this.vencMin;
    },
  },
};
</script>
