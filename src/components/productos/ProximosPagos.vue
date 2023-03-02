<template>
  <v-container class="py-0">
    <v-row justify="center">
      <v-col cols="12">
        <v-card elevation="10" class="darkGlass">
          <v-toolbar
            color="primary"
            dark
            flat
            dense
            tile
            class="mb-4 primaryGradient"
          >
            <v-toolbar-title class="flex text-center titulo"
              >Cuotas de Crédito</v-toolbar-title
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
              <v-data-table
                :headers="cabeceras"
                :items="pagos"
                disable-pagination
                disable-sort
                disable-filtering
                hide-default-footer
              >
                <template v-slot:item.mes1="{ item }">
                  {{ conv.formatMonto(item.mes1, true) }}
                </template>
                <template v-slot:item.mes2="{ item }">
                  {{ conv.formatMonto(item.mes2, true) }}
                </template>
                <template v-slot:item.mes3="{ item }">
                  {{ conv.formatMonto(item.mes3, true) }}
                </template>
              </v-data-table>
              <v-divider></v-divider>
              <v-card outlined width="380px" class="mt-2">
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr v-for="(item, i) in pactado" :key="i">
                        <td
                          :style="{
                            'background-color':
                              $vuetify.theme.themes.light.primary,
                          }"
                          style="color: white; width: 50%"
                        >
                          {{ item.nombre }}
                        </td>
                        <td style="width: 50%">
                          {{ conv.formatMonto(item.monto, true) }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
            </v-container>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import auth from "@/auth/auth";
import socio from "@/services/socio";
import NoDataApp from "../app/NoDataApp.vue";
import conv from "@/services/conversores";

export default {
  components: {
    "app-no-datos": NoDataApp,
  },
  data: function () {
    return {
      cabeceras: [
        { text: "", align: "start", sortable: true, value: "mes1" },
        {
          text: "",
          align: "start",
          sortable: true,
          value: "mes2",
        },
        { text: "", align: "start", sortable: true, value: "mes3" },
      ],
      pagos: [{ mes1: 0, mes2: 0, mes3: 0 }],
      items: [],
      pactado: [],
      noDatos: false,
      msg: "NO SE ENCONTRARON PRÓXIMOS PAGOS",
      loading: true,
    };
  },
  methods: {
    async getProximosPagos() {
      await socio
        .getProximosPagos(this.userLogged.id_cliente, 2)
        .then((response) => {
          let items = response.data[0];
          let suma = 0;
          var i = 0;
          for (const property in items) {
            if (i < 3) {
              this.cabeceras[i].text = property;
              let mes = "mes" + (i + 1);
              let valor = parseInt(parseFloat(items[property]));
              this.pagos[0][mes] = valor;

              suma += valor;
            } else {
              let monto = parseInt(parseFloat(items[property]));
              this.pactado.push({ nombre: property, monto: monto });
            }
            i++;
          }
          if (suma == 0) this.noDatos = true;
          else this.noDatos = false;
        })
        .catch((error) => console.log(error));
    },
  },
  computed: {
    conv() {
      return conv;
    },
    userLogged() {
      return auth.getUserLogged();
    },
  },
  async mounted() {
    this.loading = true;
    await this.getProximosPagos();
    this.loading = false;
  },
};
</script>
<style scoped lang="css">
.titulo {
  font-size: 3.2vh;
  line-height: 3.5vh;
  word-break: normal;
  font-weight: 300;
}
.cabecera {
  color: white;
  font-weight: 300;
  font-size: 22px;
  line-height: 22px;
}
</style>
