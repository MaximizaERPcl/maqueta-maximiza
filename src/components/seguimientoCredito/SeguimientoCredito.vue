<template>
  <v-container>
    <v-row justify="center" no-gutters>
      <v-col cols="11">
        <v-toolbar color="secondary" dark flat tile height="45px">
          <v-toolbar-title class="cabecera flex text-center"
            >Seguimiento Credito Nº {{ nCredito }}</v-toolbar-title
          >
        </v-toolbar>
        <v-card min-height="100px">
          <div v-if="web">
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  color="primary"
                  @click="
                    e6 = -1;
                    estado = null;
                    estado_credito(7);
                  "
                  class="mt-2"
                  small
                  fab
                  dark
                  absolute
                  right
                  v-on="on"
                >
                  <v-icon>mdi-reload</v-icon>
                </v-btn>
              </template>
              <span>Recargar</span>
            </v-tooltip>
            <v-stepper v-model="e6" vertical v-if="estado">
              <v-stepper-step :complete="e6 > 1" step="1">
                Solicitud de documentos
              </v-stepper-step>

              <v-stepper-content step="1">
                <cargando-app v-if="loading" />
                <formulario-docs
                  v-if="!loading && docs_subir && e6 == 1"
                  :docs_subir="docs_subir"
                  :creme_s_id="estado.creme_s_id"
                  @reload="estado_credito(7)"
                ></formulario-docs>
              </v-stepper-content>

              <v-stepper-step :complete="e6 > 2" step="2">
                Espera de aprobación
              </v-stepper-step>

              <v-stepper-content step="2">
                <v-alert
                  v-if="e6 == 2"
                  text
                  :type="alert.type"
                  dense
                  prominent
                  style="background: white !important"
                >
                  {{ alert.msg }}
                </v-alert>
              </v-stepper-content>

              <v-stepper-step :complete="e6 > 3" step="3">
                Aceptar Crédito
              </v-stepper-step>

              <v-stepper-content step="3">
                <detalle-credito
                  v-if="e6 == 3"
                  :estado="estado"
                  @reload="estado_credito(7)"
                />
              </v-stepper-content>

              <v-stepper-step :complete="e6 > 4" step="4">
                Firma electrónica de documentos
              </v-stepper-step>
              <v-stepper-content step="4">
                <firma-credito v-if="e6 == 4" :estado="estado" />
              </v-stepper-content>

              <v-stepper-step :complete="e6 > 5" step="5">
                Descargar Documentos Firmados
              </v-stepper-step>

              <v-stepper-content step="5">
                <documentos-firmados v-if="e6 == 5" :estado="estado" />
              </v-stepper-content>
            </v-stepper>
            <div v-else>
              <v-col cols="12" sm="10" md="6">
                <v-skeleton-loader
                  v-for="i in 3"
                  :key="i"
                  type="article"
                  class="ml-2"
                ></v-skeleton-loader>
              </v-col>
            </div>
          </div>

          <div v-else class="pa-8">
            <v-alert
              outlined
              type="warning"
              dense
              prominent
              style="font-size: large"
            >
              Su solicitud de crédito sigue activa, pero las condiciones han
              cambiado, por favor comunicarse con la cooperativa
            </v-alert>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="loading" hide-overlay persistent width="300">
      <v-card flat class="pt-4">
        <v-card-text class="text-center">
          Cargando Información
          <v-progress-linear
            indeterminate
            rounded
            height="8"
            color="primary"
            class="mb-0 mt-2"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import auth from "@/auth/auth";
import creditos from "@/services/creditos";
import FormularioDocumentosVue from "./Pasos/FormularioDocumentos.vue";
import CargandoApp from "../app/CargandoApp.vue";
import { mapActions } from "vuex";
import conversores from "@/services/conversores";
import DetalleCredito from "./Pasos/AceptarRechazar.vue";
import DocumentosFirmados from "./Pasos/DocumentosFirmados.vue";
import FirmaCredito from "./Pasos/FirmaCredito.vue";

export default {
  components: {
    "formulario-docs": FormularioDocumentosVue,
    "cargando-app": CargandoApp,
    "detalle-credito": DetalleCredito,
    "documentos-firmados": DocumentosFirmados,
    "firma-credito": FirmaCredito,
  },
  data() {
    return {
      e6: -1,
      estado: null,
      docs_subir: null,
      docs_status: null,
      loading: true,
      loadingStep: true,
      loadingDocs: false,
      alert: {},
      docs: [],
      web: true,
      nCredito: null,
    };
  },
  computed: {
    userLogged() {
      return auth.getUserLogged();
    },
    colsCalculate() {
      return Math.ceil(this.docs.length / 5);
    },
    conv() {
      return conversores;
    },
  },
  methods: {
    ...mapActions(["mostrarAlerta", "set_timeout", "close_timeout"]),
    async estado_credito(accion) {
      this.loading = true;
      let data = {
        accion: accion,
        clien_s_id: this.userLogged.id_cliente,
      };
      await creditos
        .estado_credito(data)
        .then(async (response) => {
          let data = response.data[0];
          if (data && accion == 7) {
            this.estado = data;
            this.nCredito = data.creme_s_id;
            this.web = data.firma_fao === "1" ? true : false;
            let atrib_s_id = parseInt(data.atrib_s_id);
            await this.documentacion_credito(5);
            //Etapa 1
            if (this.docs_status > 0 && atrib_s_id == 1) {
              this.e6 = 1;
            }
            //Etapa 2
            else if (this.docs_status < 0 && atrib_s_id == 1) {
              this.e6 = 2;
            }

            //Etapa 3
            else if (atrib_s_id == 3) {
              this.e6 = 3; //Etapa 3
            }

            //Etapa 4
            else if (
              parseInt(data.n_doc_firmar) >= 0 &&
              (atrib_s_id == 4 || atrib_s_id == 5)
            ) {
              this.e6 = 4;
            }
            //Etapa 1
            else {
              this.e6 = 5;
            }
          } else {
            this.mostrarAlerta({
              mostrar: true,
              mensaje: "Actualmente no posee créditos para seguimiento web",
              color: "error",
              icon: "",
            });
            let userEdit = this.userLogged;
            userEdit.b_creditos_firmar = 0;
            auth.updateUserLogged(userEdit);
            this.$router.push("/inicio");
          }
        })
        .catch((error) => console.log(error))
        .finally(() => (this.loading = false));
    },
    async documentacion_credito(accion) {
      let data = {
        accion: accion,
        aatcn_s_id: this.estado.aatcn_s_id,
        creme_s_id: this.estado.creme_s_id,
      };
      await creditos
        .obtener_documentacion(data)
        .then((response) => {
          let data = response.data;

          if (accion == 5) {
            if (data.length == 1 && data[0].return_value === "-1") {
              this.docs_status = parseInt(data[0].return_value);
              this.alert = { msg: data[0].msg, type: "success" };
            } else {
              this.docs_status = 1;
              this.docs_subir = data;
            }
          }
        })
        .catch((error) => console.log(error));
    },
  },
  async mounted() {
    this.loading = true;
    if (localStorage.getItem("firma") != null) {
      let vm = this;
      this.close_timeout();
      setTimeout(async function () {
        await vm.estado_credito(7);

        if (vm.e6 == 5) {
          vm.mostrarAlerta({
            mostrar: true,
            mensaje: "Firma realizada correctamente",
            color: "success",
            icon: "",
          });
        } else if (vm.e6 != 5) {
          vm.mostrarAlerta({
            mostrar: true,
            mensaje:
              "Ocurrió un error al realizar la firma electrónica, recargue la información del crédito e intente firmar nuevamente, si el error persiste comúniquese con un administrador",
            color: "error",
            icon: "",
          });
        }
        setTimeout(function () {
          vm.set_timeout();
        }, 10000);
        localStorage.removeItem("firma");
      }, 2000);
    } else {
      await this.estado_credito(7);
    }
  },
};
</script>
<style scoped>
.cabecera {
  color: white;
  font-weight: 300;
  font-size: 22px;
  line-height: 28px;
  word-break: normal;
}
</style>
