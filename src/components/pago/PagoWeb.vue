<template>
  <v-container class="py-0" v-if="pagos">
    <v-row justify="center" no-gutters>
      <v-col cols="11">
        <v-card elevation="10">
          <v-toolbar
            color="primary"
            dark
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
          <div v-else>
            <app-no-datos v-if="noDatos" v-bind:msg="msg"></app-no-datos>

            <v-container v-else>
              <v-row dense>
                <v-col cols="12" md="8">
                  <v-data-table
                    v-model="selectedCapital"
                    dense
                    :headers="cabecerasCapital"
                    :items="indexedCapital"
                    hide-default-header
                    hide-default-footer
                    class="mx-1 mb-4 elevation-1"
                    calculate-widths
                    show-select
                  >
                    <template v-slot:item.vigente="{}">
                      Abono Pactado
                    </template>
                    <template v-slot:item.abono_pactado="{ item }">
                      {{ conv.formatMonto(item.abono_pactado, true) }}
                    </template>
                    <template v-slot:top>
                      <v-system-bar
                        flat
                        outlined
                        dense
                        :color="colorCabeceras"
                        height="35"
                      >
                        <v-toolbar-title class="flex text-center cabecera"
                          >Capital</v-toolbar-title
                        >
                      </v-system-bar>
                    </template>
                  </v-data-table>

                  <!-- Pago creditos-->
                  <v-data-table
                    v-model="selected"
                    dense
                    :headers="cabeceras2"
                    :items="indexedItems"
                    class="mx-1 mb-4 elevation-1"
                    group-by="credito"
                    calculate-widths
                    show-group-by
                    show-select
                    @item-selected="seleccionItem"
                    hide-default-footer
                    :item-per-page="-1"
                  >
                    <template v-slot:group.header="{ group }">
                      <td colspan="7">
                        <span class="grupo"> Credito: {{ group }} </span>
                      </td>
                    </template>
                    <template v-slot:item.monto="{ item }">
                      {{ conv.formatMonto(item.monto, true) }}
                    </template>

                    <template v-slot:top>
                      <v-system-bar
                        flat
                        outlined
                        dense
                        :color="colorCabeceras"
                        height="35"
                      >
                        <v-toolbar-title class="flex text-center cabecera"
                          >Créditos</v-toolbar-title
                        >
                      </v-system-bar>
                    </template>
                  </v-data-table>
                  <v-data-table
                    v-model="selected"
                    dense
                    :headers="cabecerasGym"
                    :items="indexedItemsGym"
                    class="mx-1 mb-4 elevation-1"
                    calculate-widths
                    hide-default-footer
                    :items-per-page="-1"
                  >
                    <template v-slot:top>
                      <v-system-bar
                        flat
                        outlined
                        dense
                        :color="colorCabeceras"
                        height="35"
                      >
                        <v-toolbar-title class="flex text-center cabecera"
                          >Gimnasio</v-toolbar-title
                        >
                      </v-system-bar>
                    </template>
                  </v-data-table>
                  <v-select
                    v-model="selectedGym"
                    :items="pagos.venta_plan"
                    :style="{
                      width: $vuetify.breakpoint.mdAndUp ? '18rem' : '100%',
                    }"
                    dense
                    item-text="nombre"
                    label="Renovar Plan"
                    placeholder="Seleccione un plan"
                    solo
                    background-color="grey lighten-3"
                    flat
                    return-object
                    clearable
                    no-data-text="No posee planes de gimnasio disponibles"
                    menu-props="offsetY"
                  >
                    <template v-slot:item="{ item }">
                      <v-row no-gutters>
                        <v-col> {{ item.nombre }}: </v-col>
                        <v-col>
                          {{ conv.formatMonto(item.valor, true) }}
                        </v-col>
                      </v-row>
                    </template>
                    <template v-slot:selection="{ item }">
                      <v-row no-gutters>
                        {{ item.nombre }}:
                        {{ conv.formatMonto(item.valor, true) }}
                      </v-row>
                    </template>
                  </v-select>
                  <v-data-table
                    v-model="selectedComCre"
                    show-select
                    dense
                    :headers="cabecerasComCre"
                    :items="indexedItemsComCre"
                    class="mx-1 mb-4 elevation-1"
                    calculate-widths
                    hide-default-footer
                    :items-per-page="-1"
                  >
                    <template v-slot:item.monto="{ item }">
                      {{ conv.formatMonto(item.monto, true) }}
                    </template>
                    <template v-slot:top>
                      <v-system-bar
                        flat
                        outlined
                        dense
                        :color="colorCabeceras"
                        height="35"
                      >
                        <v-toolbar-title class="flex text-center cabecera"
                          >Comisión por useo de tarjeta de
                          crédito</v-toolbar-title
                        >
                      </v-system-bar>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col cols="12" md="4">
                  <v-card outlined flat>
                    <v-card-title class="cabecera black--text">
                      Total a pagar: {{ conv.formatMonto(total, true) }}
                    </v-card-title>
                    <v-divider />
                    <v-card-text>
                      <v-simple-table dense>
                        <template v-slot:default>
                          <tbody>
                            <tr v-for="(total, i) in totales" :key="i">
                              <td>{{ total.tipo }}</td>
                              <td>{{ conv.formatMonto(total.monto, true) }}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </v-card-text>
                    <v-divider />
                    <v-card-actions class="justify-center">
                      <v-btn
                        class="ma-2"
                        color="success"
                        :disabled="total == 0"
                      >
                        <v-icon left>mdi-credit-card-check</v-icon>
                        Pagar Productos
                      </v-btn>
                    </v-card-actions>
                    <v-alert
                      outlined
                      type="warning"
                      dense
                      prominent
                      class="mx-1 mb-1"
                    >
                      Recuerde realizar pago con tarjeta de débito, de lo
                      contrario se cobrará otro cargo por servicio.
                    </v-alert>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import data from "./data.json";
import conv from "@/services/conversores";

export default {
  data() {
    return {
      pagos: data,
      total: 0,
      selected: [],
      selectedCapital: [],
      selectedComCre: [],
      selectedGym: [],
      cabecerasComCre: [
        {
          text: "Fecha",
          align: "start",
          sortable: true,
          groupable: false,
          value: "fecha",
        },
        {
          text: "Monto",
          align: "start",
          sortable: true,
          groupable: true,
          value: "monto",
        },
      ],
      cabecerasCapital: [
        {
          text: "Abono",
          align: "start",
          sortable: true,
          groupable: true,
          value: "vigente",
        },
        {
          text: "Monto",
          align: "start",
          sortable: true,
          groupable: false,
          value: "abono_pactado",
        },
      ],
      cabecerasGym: [
        {
          text: "Plan",
          align: "start",
          sortable: true,
          groupable: true,
          value: "nombre_plan",
        },
        {
          text: "Fecha Inicio",
          align: "start",
          sortable: true,
          groupable: false,
          value: "fecha_inicio",
        },
        {
          text: "Fecha Término",
          align: "start",
          sortable: true,
          groupable: false,
          value: "fecha_termino",
        },
      ],
      cabeceras2: [
        {
          text: "Credito",
          align: "start",
          sortable: true,
          groupable: true,
          value: "credito",
        },
        {
          text: "Producto",
          align: "start",
          sortable: true,
          groupable: false,
          value: "producto",
        },
        {
          text: "Cuota",
          align: "start",
          sortable: true,
          groupable: false,
          value: "cuota",
        },
        /*{ text: 'Nº Cuota',
            align: 'start',
            sortable: true, 
            groupable: false,
            value: 'n_cuota' 
          },*/
        {
          text: "Estado",
          align: "start",
          sortable: true,
          groupable: false,
          value: "estado_cuota",
        },
        {
          text: "Vencimiento",
          align: "start",
          sortable: true,
          groupable: false,
          value: "vencimiento",
        },
        {
          text: "Monto",
          align: "start",
          sortable: true,
          groupable: false,
          value: "monto",
        },
      ],
      colorCabeceras: "secondary",
      totales: [
        {
          tipo: "Cuotas",
          monto: 0,
        },
        {
          tipo: "Gimnasio",
          monto: 0,
        },
        {
          tipo: "Abono Capital",
          monto: 0,
        },
        {
          tipo: "Cargo por Tarjeta de Crédito",
          monto: 0,
        },
        {
          tipo: "Cargo por servicio",
          monto: 0,
        },
      ],
      noDatos: false,
      msg: "NO POSEE PAGOS ASOCIADOS ",
      loading: false,
      userLogged: null,
    };
  },
  methods: {
    sumAll() {
      let tempSuma = 0;
      this.totales[4].monto = 0;
      this.totales.forEach((item) => {
        tempSuma += item.monto;
      });
      let cargo =
        (tempSuma * parseFloat(this.pagos.tasa_web[0].tasa_tbk)) / 100;
      this.totales[4].monto = Math.ceil(cargo);

      this.total = tempSuma + this.totales[4].monto;
    },
    seleccionItem({ value, item }) {
      if (value) {
        this.selected.push(item);
        let items = this.indexedItems;
        //console.log(items)
        let filtrado = items.filter(
          (pago) =>
            pago.id != item.id &&
            pago.credito === item.credito &&
            parseInt(pago.n_cuota) < parseInt(item.n_cuota)
        );
        this.selected = this.selected.concat(filtrado);
      } else {
        //console.log(this.selected)
        this.selected = this.selected.filter(
          (pago) =>
            (pago.id != item.id &&
              pago.credito === item.credito &&
              parseInt(pago.n_cuota) < parseInt(item.n_cuota)) ||
            pago.credito !== item.credito
        );
      }
    },
  },
  computed: {
    conv() {
      return conv;
    },
    indexedItems() {
      return this.pagos.credito.map((item, index) => ({
        id: index,
        ...item,
      }));
    },
    indexedCapital() {
      return this.pagos.capital.map((item, index) => ({
        id: index,
        ...item,
      }));
    },
    indexedItemsGym() {
      return this.pagos.plan_contratado.map((item, index) => ({
        id: index,
        ...item,
      }));
    },
    indexedItemsComCre() {
      return this.pagos.comision_credito.map((item, index) => ({
        id: index,
        ...item,
      }));
    },
  },
  watch: {
    selected() {
      let tempSuma = 0;
      this.selected.forEach((item) => {
        tempSuma += parseInt(item.monto);
      });
      this.totales[0].monto = tempSuma;
      this.sumAll();
    },
    selectedCapital() {
      let tempSuma = 0;
      this.selectedCapital.forEach((item) => {
        tempSuma += parseInt(item.abono_pactado);
      });
      this.totales[2].monto = tempSuma;
      this.sumAll();
    },
    selectedComCre() {
      let tempSuma = 0;
      this.selectedComCre.forEach((item) => {
        tempSuma += parseInt(item.monto);
      });
      this.totales[3].monto = tempSuma;
      this.sumAll();
    },
    selectedGym(newVal) {
      if (newVal) {
        this.totales[1].monto = parseInt(newVal.valor);
      } else this.totales[1].monto = 0;
      this.sumAll();
    },
  },
};
</script>
<style>
.titulo {
  font-size: 30px;
  line-height: 30px;
  word-break: normal;
  font-weight: 300;
}
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
