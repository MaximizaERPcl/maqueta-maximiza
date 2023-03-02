<template>
  <div v-if="creditos">
    <v-data-table
      v-model="selected"
      dense
      :headers="cabecera.credito"
      :items="indexedItems"
      class="mx-1 mb-4 elevation-1"
      group-by="credito"
      single-select
      show-select
      hide-default-footer
      no-data-text="No posee créditos por pagar"
      @item-selected="seleccionItem"
      :items-per-page.sync="perPage"
    >
      <template v-slot:group.header="{ group }">
        <td colspan="7">
          <span class="grupo"> Credito: Nº {{ group }} </span>
        </td>
      </template>
      <template v-slot:item.monto="{ item }">
        <div v-if="!selectCredito(item, selected)">
          {{ conv.formatMonto(item.monto, true) }}
        </div>
        <div v-else>
          <v-form v-model="validCredito">
            <v-text-field
              required
              v-if="selectedAux[findIdx(item.id, 'selectedAux')]"
              :placeholder="placeholder(indexedItems, item.id, 'monto')"
              persistent-placeholder
              v-model="selectedAux[findIdx(item.id, 'selectedAux')].monto"
              dense
              hide-details="auto"
              single-line
              v-mask="currencyMask"
              @input="formatAmount(item.id, 'selected', 'monto')"
              :rules="[
                rules.required,
                (v) =>
                  !!v &&
                  revisarMonto(item.id, 'selectedAux', 'indexedItems', 'monto'),
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
          <v-toolbar-title class="flex text-center cabecera"
            >Créditos</v-toolbar-title
          >
        </v-system-bar>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import auth from "@/auth/auth";
import cabeceras from "./cabeceras.json";
import conv from "@/services/conversores";
import moment from "moment";
import createNumberMask from "text-mask-addons/dist/createNumberMask";
export default {
  data() {
    return {
      cabecera: cabeceras,
      loading: true,
      validCredito: true,
      colorCabeceras: "secondary",
      perPage: -1,
      selectedAux: [],
      selected: [],
      currencyMask: createNumberMask({
        prefix: "$",
        includeThousandsSeparator: true,
        allowNegative: false,
        thousandsSeparatorSymbol: ".",
      }),
      rules: {
        required: (value) => !!value || "Campo requerido.",
      },
    };
  }, //data
  methods: {
    selectCredito(item, array) {
      let last_cuota_id = -1;
      array.forEach((elem) => {
        let date1 = new Date(
          moment(elem.vencimiento, "DD/MM/YYYY").format("YYYY-MM-DD")
        );
        let date2 = new Date(
          moment(item.vencimiento, "DD/MM/YYYY").format("YYYY-MM-DD")
        );
        if (elem.credito === item.credito && date1 >= date2)
          last_cuota_id = elem.id;
      });
      return last_cuota_id == item.id ? true : false;
    }, //selectCredito
    findIdx(id, arr) {
      return this[arr].findIndex((e) => e.id == id);
    },
    formatAmount(id, arr, val) {
      let idxOr = this[arr].findIndex((item) => item.id == id);
      let idxAux = this[arr + "Aux"].findIndex((item) => item.id == id);
      let current = this[arr + "Aux"][idxAux][val];
      if (current && current != "$")
        this[arr][idxOr][val] = this.desmonetizar(current);
      else this[arr][idxOr][val] = "0";
    },
    placeholder(arr, id, val) {
      let index = arr.findIndex((item) => item.id == id);
      return conv.formatMonto(arr[index][val], true);
    },
    async seleccionItem({ value, item }) {
      let temp_item = JSON.parse(JSON.stringify(item));
      if (value) {
        let tempArray = [...this.selected];
        tempArray.push(temp_item);
        let items = this.indexedItems;
        let filtrado = await items.filter(
          (pago) =>
            pago.id != temp_item.id &&
            pago.credito === temp_item.credito &&
            parseInt(pago.n_cuota) < parseInt(temp_item.n_cuota)
        );
        tempArray = tempArray.concat(filtrado);
        tempArray = tempArray.filter(
          (item, index) =>
            tempArray.findIndex((elem) => item.id == elem.id) == index
        );
        this.selectedAux = JSON.parse(JSON.stringify(tempArray));
        this.selected = [...tempArray];
      } else {
        this.selected = await this.selected.filter(
          (pago) =>
            (pago.id != temp_item.id &&
              pago.credito === temp_item.credito &&
              parseInt(pago.n_cuota) < parseInt(temp_item.n_cuota)) ||
            pago.credito !== temp_item.credito
        );
        this.selectedAux = JSON.parse(JSON.stringify(this.selected));
      }
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
    desmonetizar(monto) {
      return monto.replace("$", "").split(".").join("");
    },
  }, //methods
  computed: {
    indexedItems() {
      return this.creditos.map((item, index) => ({
        id: index,
        ...item,
      }));
    }, //indexedItems
    conv() {
      return conv;
    }, //conv
    userLogged() {
      return auth.getUserLogged();
    },
  }, //computed
  watch: {
    selected: function () {
      this.$root.$emit("enviarCredito", this.selected);
    },
    validCredito: function () {
      this.$root.$emit("validCredito", this.validCredito);
    },
  }, //watch
  props: {
    creditos: null,
  }, //props
}; //dafault
</script>
<style scoped>
.cabecera {
  color: white;
  font-weight: 300;
  font-size: 20px;
  line-height: 22px;
}
.grupo {
  font-size: 16px;
  font-weight: 400;
  line-height: 18px;
}
</style>
