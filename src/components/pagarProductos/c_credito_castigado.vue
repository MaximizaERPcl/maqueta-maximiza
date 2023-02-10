<template>
  <div v-if="castigados">
    <v-data-table
      v-if="castigados.length > 0 /*&& userLogged.b_paga_credito === '1'*/"
      v-model="selectedCastigados"
      dense
      :headers="cabecera.credito_castigado"
      :items="indexedCastigados"
      class="mx-1 mb-4 elevation-1"
      show-select
      single-select
      @item-selected="selectItem($event, 'selectedCastigados')"
      hide-default-footer
      :items-per-page.sync="perPage"
      no-data-text="No posee créditos por pagar"
    >
      <template v-slot:item.vencimiento="{ item }">
        {{ conv.formatFecha2(item.vencimiento, "YYYY-MM-DD") }}
      </template>
      <template v-slot:item.credito="{ item }"> Nº{{ item.credito }} </template>
      <template v-slot:item.valor_cuota="{ item }">
        <div v-if="!selectedItem(item.id, selectedCastigados)">
          {{ conv.formatMonto(item.valor_cuota, true) }}
        </div>
        <div v-else>
          <v-form v-model="validCredito">
            <v-text-field
              required
              v-if="
                selectedCastigadosAux[findIdx(item.id, 'selectedCastigadosAux')]
              "
              v-model="
                selectedCastigadosAux[findIdx(item.id, 'selectedCastigadosAux')]
                  .valor_cuota
              "
              :placeholder="
                placeholder(indexedCastigados, item.id, 'valor_cuota')
              "
              persistent-placeholder
              dense
              hide-details="auto"
              single-line
              v-mask="currencyMask"
              @input="
                formatAmount(item.id, 'selectedCastigados', 'valor_cuota')
              "
              :rules="[
                rules.required,
                (v) =>
                  !!v &&
                  revisarMonto(
                    item.id,
                    'selectedCastigadosAux',
                    'indexedCastigados',
                    'valor_cuota'
                  ),
              ]"
            >
              <template v-slot:append-outer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon small v-on="on" color="warning">
                      mdi-pencil
                    </v-icon>
                  </template>
                  Abono
                </v-tooltip>
              </template>
            </v-text-field>
          </v-form>
        </div>
      </template>
      <template v-slot:top>
        <v-system-bar flat outlined dense :color="colorCabeceras" height="35">
          <v-toolbar-title class="flex text-center cabecera">
            Créditos Castigados
          </v-toolbar-title>
        </v-system-bar>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import auth from "@/auth/auth";
import cabeceras from "./cabeceras.json";
import conv from "@/services/conversores";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
export default {
  data() {
    return {
      selectedCastigados: [],
      cabecera: cabeceras,
      colorCabeceras: "secondary",
      perPage: -1,
      validCredito: true,
      selectedCastigadosAux: [],
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
    selectItem(event, array) {
      let item = event.item;
      let value = event.value;

      if (value) {
        let temp_item = JSON.parse(JSON.stringify(item));
        this[array].push(temp_item);
        this[array + "Aux"] = JSON.parse(JSON.stringify(this[array]));
      } else {
        this[array].pop();
        this[array + "Aux"].pop();
      }
    },
    selectedItem(id, array) {
      return array.findIndex((item) => item.id == id) >= 0 ? true : false;
    },
    placeholder(arr, id, val) {
      let index = arr.findIndex((item) => item.id == id);
      return conv.formatMonto(arr[index][val], true);
    },
    formatAmount(id, arr, val) {
      let idxOr = this[arr].findIndex((item) => item.id == id);
      let idxAux = this[arr + "Aux"].findIndex((item) => item.id == id);
      let current = this[arr + "Aux"][idxAux][val];
      if (current && current != "$")
        this[arr][idxOr][val] = this.desmonetizar(current);
      else this[arr][idxOr][val] = "0";
    },
    revisarMonto(id, arr1, arr2, val) {
      let monto = parseInt(
        this.desmonetizar(this[arr1].find((item) => item.id == id)[val])
      );
      let max = parseInt(this[arr2].find((item) => item.id == id)[val]);
      if (monto > max)
        return false || "Monto máximo: " + conv.formatMonto(max, true);
      else if (monto == 0) return false || "Monto mínimo: " + "$1";
      else return true;
    },
    findIdx(id, arr) {
      return this[arr].findIndex((e) => e.id == id);
    },
    desmonetizar(monto) {
      return monto.replace("$", "").split(".").join("");
    },
  }, //methods
  computed: {
    conv() {
      return conv;
    }, //conv
    userLogged() {
      return auth.getUserLogged();
    }, //userLogged
    indexedCastigados() {
      return this.castigados.map((item, index) => ({
        id: index,
        ...item,
      }));
    },
  }, //computed
  watch: {
    selectedCastigados: function () {
      this.$root.$emit("enviarCastigados", this.selectedCastigados);
    },
    validCredito: function () {
      this.$root.$emit("validCastigados", this.validCredito);
    },
  }, //watch
  props: {
    castigados: null,
  },
}; //default
</script>

<style>
.cabecera {
  color: white;
  font-weight: 300;
  font-size: 20px;
  line-height: 22px;
}
</style>
