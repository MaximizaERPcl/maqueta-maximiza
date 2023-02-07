<template>
  <v-container class="pa-0">
    <cargando-app v-if="loadingResponse" />
    <div v-else>
      <v-alert
        text
        :type="alert.type"
        dense
        prominent
        style="background: white !important"
        v-if="alert"
      >
        {{ alert.msg }}
      </v-alert>
      <v-btn
        raised
        width="310px"
        v-if="estado_firma && estado_firma.codigo === '1'"
        :loading="loadingFirma"
        :disabled="loadingFirma"
        color="success"
        @click="generarLink()"
      >
        Firmar Online
        <v-icon right>mdi-draw</v-icon>
        <template v-slot:loader>
          <span>Preparando Documentación </span>
          <v-progress-circular
            class="ml-4"
            indeterminate
            color="grey"
            size="18"
            width="2"
          ></v-progress-circular>
        </template>
      </v-btn>
    </div>
  </v-container>
</template>
<script>
import creditos from "@/services/creditos";
import auth from "@/auth/auth";
import CargandoApp from "../../app/CargandoApp.vue";
export default {
  components: {
    "cargando-app": CargandoApp,
  },
  props: {
    estado: Object,
  },
  data() {
    return {
      loadingFirma: false,
      estado_firma: null,
      loadingResponse: false,
      alert: null,
    };
  },
  computed: {
    userLogged() {
      return auth.getUserLogged();
    },
  },
  methods: {
    async generarLink() {
      this.loadingFirma = true;
      await this.documentos_firmar(2);
      this.loadingFirma = false;
    },
    async documentos_firmar(accion) {
      let payload = {};
      let form = {
        accion: accion,
        clien_s_id: this.userLogged.id_cliente,
        wdfen_s_id_producto: this.estado.creme_s_id,
      };
      await creditos
        .documentos_firmar(form)
        .then((response) => {
          let data = response.data[0];
          if (accion == 1) {
            this.estado_firma = data;
            if (data.codigo === "1")
              this.alert = { msg: data.msg, type: "success" };
            else this.alert = { msg: data.msg, type: "warning" };
          } else {
            if (data.return_value === "1") {
              payload = {
                mensaje:
                  "Será redirigido a la página de ECERT para completar el proceso de firma online",
                color: "success",
                mostrar: true,
              };
              window.location.href = data.UrlLoginECert;
            } else
              payload = {
                mensaje: data.msg_error,
                color: "error",
                mostrar: true,
              };
            this.mostrarAlerta(payload);
          }
          this.loadingResponse = false;
        })
        .catch((error) => {
          console.log(error);
          payload = {
            mensaje:
              "Error al obtener la documentación para firmar, si el error persiste contacte con un administrador",
            color: "error",
            mostrar: true,
          };
          this.mostrarAlerta(payload);
        });
    },
  },
  async mounted() {
    this.loadingResponse = true;
    await this.documentos_firmar(1);
  },
  // watch:{
  //   estado_firma(){
  //     console.log('watch',this.estado_firma)
  //   }
  // }
};
</script>
