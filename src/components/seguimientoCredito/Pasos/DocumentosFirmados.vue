<template>
  <div>
    <cargando-app v-if="loadingDocs" />
    <v-data-iterator v-else :items="docs" hide-default-footer>
      <template v-slot:default="props">
        <v-row no-gutters>
          <v-card flat>
            <div v-for="(doc, i) in props.items" :key="i">
              <v-hover v-slot="{ hover }">
                <v-card
                  outlined
                  rounded="pill"
                  class="my-2"
                  link
                  :elevation="hover ? 2 : 0"
                  ripple
                >
                  <v-list-item @click="descargarDocumentos(doc)" inactive>
                    <v-icon
                      left
                      color="
                              red
                            "
                    >
                      mdi-file-pdf-box
                    </v-icon>
                    <v-list-item-content>{{
                      i + 1 + ". " + doc.nombre_doc + ".pdf"
                    }}</v-list-item-content>

                    <v-list-item-icon>
                      <v-icon small left>mdi-download</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-card>
              </v-hover>
            </div>
          </v-card>
        </v-row>
      </template>
      <template v-slot:no-data>
        <div class="text-center">
          <v-img
            :src="require('@/assets/app/no-file.png')"
            height="50"
            width="50"
            contain
            class="mx-auto"
          />
          No se encontraron documentos firmados
        </div>
      </template>
    </v-data-iterator>
    <div class="mt-6">
      <v-alert
        text
        type="success"
        dense
        prominent
        style="background: white !important"
      >
        <span v-if="estado.estado === '1'">
          Su crédito está en proceso de autorización.
        </span>
        <span v-else-if="estado.estado === '2'">
          Su crédito está en proceso de ser entregado.
        </span>
      </v-alert>
    </div>
  </div>
</template>
<script>
import creditos from "@/services/creditos";
import CargandoApp from "../../app/CargandoApp.vue";
export default {
  components: {
    "cargando-app": CargandoApp,
  },
  props: {
    estado: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loadingDocs: false,
      docs: [],
    };
  },
  methods: {
    async getFirmados() {
      this.loadingDocs = true;
      let form = {
        accion: 14,
        creme_s_id: this.estado.creme_s_id,
      };
      await creditos
        .listar_firmados(form)
        .then((response) => {
          console.log(response.data);
          if (response.data[0].return_value === "1") this.docs = response.data;
        })
        .catch((error) => console.log(error));
      this.loadingDocs = false;
    },
    descargarDocumentos(item) {
      var a = document.createElement("a");
      a.href = "data:application/octet-stream;base64," + item.documento_b64;
      a.download = item.nombre_doc + ".pdf";
      a.click();
    },
  },
  mounted() {
    this.getFirmados();
  },
};
</script>
