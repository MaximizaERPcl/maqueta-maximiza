<template>
  <v-data-table
    v-if="libretas"
    :headers="cabecera.libretas"
    :items="indexedAhorro"
    v-model="selectedLibreta"
    dense
    hide-default-footer
    show-select
    class="mx-1 mb-4 elevation-1"
  >
    <template v-slot:item.nombre="{ item }">
      {{ conv.capitalizeString(item.nombre) }}
    </template>
    <template v-slot:item.saldo="{ item }"> ${{ item.saldo }} </template>
    <template v-slot:item.amount="{ item }">
      <div v-if="!selectedItem(item.id, selectedLibreta)">
        {{ conv.formatMonto(item.abono_minimo, true) }}
      </div>
      <div v-else>
        <v-form v-model="validAhorro">
          <v-text-field
            required
            dense
            hide-details="auto"
            single-line
            v-mask="currencyMask"
            v-model="selectedLibreta[findIdx(item.id, selectedLibreta)].amount"
            @input="formatRealValue(item.id)"
            :rules="[
              rules.required,
              (v) => !!v && revisarMonto(findIdx(item.id, selectedLibreta)),
            ]"
          >
            <template v-slot:append-outer>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-icon small v-on="on" color="warning"> mdi-pencil </v-icon>
                </template>
                Abono Cuenta de Ahorro
              </v-tooltip>
            </template>
          </v-text-field>
        </v-form>
      </div>
    </template>
    <template v-slot:top>
      <v-system-bar flat outlined dense :color="colorCabeceras" height="35">
        <v-toolbar-title class="flex text-center cabecera"
          >Cuentas de ahorro</v-toolbar-title
        >
      </v-system-bar>
    </template>
  </v-data-table>
</template>
<script>
import cabeceras from "./cabeceras.json";
import conv from "@/services/conversores";
import createNumberMask from "text-mask-addons/dist/createNumberMask";

export default {
  data() {
    return {
      cabecera: cabeceras,
      loading: true,
      colorCabeceras: "secondary",
      selectedLibreta: [],
      validAhorro: true,
      currencyMask: createNumberMask({
        prefix: "$",
        includeThousandsSeparator: true,
        allowNegative: false,
        thousandsSeparatorSymbol: ".",
      }),
      rules: {
        required: (value) => !!value || "Campo requerido.",
      },
    }; //return
  }, //data
  methods: {
    findIdx(id, arr) {
      return arr.findIndex((e) => e.id == id);
    },
    selectedItem(id, array) {
      return array.findIndex((item) => item.id == id) >= 0 ? true : false;
    },
    formatRealValue(id) {
      let itemId = this.selectedLibreta.findIndex((item) => item.id == id);
      let current = this.selectedLibreta[itemId].amount;
      if (current && current != "$")
        this.selectedLibreta[itemId].monto = this.desmonetizar(current);
      else this.selectedLibreta[itemId].monto = 0;
    },
    desmonetizar(monto) {
      return monto.replace("$", "").split(".").join("");
    },
    revisarMonto(idx) {
      let monto = parseInt(this.selectedLibreta[idx].monto);
      let min = parseInt(this.indexedAhorro[idx].abono_minimo);
      let max = parseInt(this.indexedAhorro[idx].abono_maximo);
      if (max == 0) max = monto + 1;
      if (monto < min)
        return false || "Monto mínimo: " + conv.formatMonto(min, true);
      else if (monto > max)
        return false || "Monto máximo: " + conv.formatMonto(max, true);
      else return true;
    },
  }, //methods
  computed: {
    conv() {
      return conv;
    },
    indexedAhorro() {
      return this.libretas.map((item, index) => ({
        id: index,
        amount: item.abono_minimo,
        monto: item.abono_minimo,
        ...item,
      }));
    },
  }, //computed
  watch: {
    selectedLibreta: {
      handler() {
        this.$root.$emit("enviarAhorro", this.selectedLibreta);
      },
      deep: true,
    },
    validAhorro: function () {
      this.$root.$emit("validAhorro", this.validAhorro);
    },
  },
  props: {
    libretas: null,
  }, //props
}; //export default
</script>

<style scoped>
.cabecera {
  color: white;
  font-weight: 300;
  font-size: 20px;
  line-height: 22px;
}
</style>
