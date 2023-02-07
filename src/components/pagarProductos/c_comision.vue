<template>
  <div v-if="pagos">
    <v-data-table
      v-if="indexedItemsComCre.length > 0"
      v-model="selectedComCre"
      show-select
      single-select
      dense
      :headers="cabecera.comision"
      :items="indexedItemsComCre"
      class="mx-1 mb-4 elevation-1"
      hide-default-footer
      no-data-text="No posee comisiones por pagar"
      :items-per-page="-1"
    >
      <template v-slot:item.monto="{ item }">
        {{ conv.formatMonto(item.monto, true) }}
      </template>
      <template v-slot:top>
        <v-system-bar flat outlined dense :color="colorCabeceras" height="35">
          <v-toolbar-title class="flex text-center cabecera">
            Adeudado por comisión por uso de tarjeta de crédito
          </v-toolbar-title>
        </v-system-bar>
      </template>
      <template v-slot:item.data-table-select>
        <v-simple-checkbox disabled :value="true"></v-simple-checkbox>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import cabeceras from "./cabeceras.json";
import conv from "@/services/conversores";

export default {
  data() {
    return {
      selectedComCre: [],
      cabecera: cabeceras,
      colorCabeceras: "secondary",
    }; //return
  }, //data
  computed: {
    indexedItemsComCre() {
      if (this.pagos.comision_credito.length >= 0) {
        let indexedArray = this.pagos.comision_credito.map((item, index) => ({
          id: index,
          ...item,
        }));
        this.$root.$emit("enviarComision", this.pagos.comision_credito);
        return indexedArray;
      } else return [];
    }, //indexedItemsComCre
    conv() {
      return conv;
    }, //conv
  }, //computed
  watch: {
    selectedComCre: function () {
      this.$root.$emit("enviarComision", this.selectedComCre);
    },
  },//watch
  props:{
    pagos:null,
  },//props
}; //default
</script>
