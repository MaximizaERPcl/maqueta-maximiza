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
      <div v-if="estado_firma && estado_firma.codigo === '1'">
        <v-btn
          raised
          width="310px"
          :loading="loadingFirma"
          :disabled="loadingFirma || !correo"
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
        <v-alert v-if="!correo" dense text type="error" class="mt-2 subtitle-2">
          No puede firmar ya que posee datos pendientes de actualización, por
          favor comunicarse con la cooperativa
        </v-alert>
      </div>
    </div>
  </v-container>
</template>
<script>
import creditos from "@/services/creditos";
import auth from "@/auth/auth";
import funciones from "@/services/funciones";
import CargandoApp from "../../app/CargandoApp.vue";
import { mapActions } from "vuex";
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
      correo: false,
    };
  },
  computed: {
    userLogged() {
      return auth.getUserLogged();
    },
  },
  methods: {
    ...mapActions(["mostrarAlerta", "close_timeout"]),
    async getUserInfo() {
      //get info user from auth
      await auth
        .userInfo(this.userLogged.id_cliente)
        .then((response) => {
          let user = response.data[0];
          this.correo = funciones.validateEmail(user.email_personal);
        })
        .catch((error) => console.log(error));
    },
    async generarLink() {
      this.close_timeout();
      this.loadingFirma = true;
      await this.documentos_firmar(2);
      this.loadingFirma = false;
    },
    async documentos_firmar(accion) {
      let payload = {};
      let form = {
        accion: accion,
        clien_s_id: this.userLogged.id_cliente,
        creme_s_id: this.estado.creme_s_id,
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
              this.close_timeout();
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
    await this.getUserInfo();
    await this.documentos_firmar(1);
  },
};
</script>
