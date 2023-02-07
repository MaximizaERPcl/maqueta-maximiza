<template>
  <v-card outlined max-width="500">
    <v-toolbar height="40" color="primary" dark flat class="primary" tile>
      <v-toolbar-title class="flex text-center"
        >Evaluación aprobada</v-toolbar-title
      >
    </v-toolbar>
    <v-list v-if="estado">
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary"> mdi-briefcase-account </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle> Producto </v-list-item-subtitle>
          <v-list-item-title>
            Crédito
            {{ conv.capitalizeString(estado.procm_c_nombre.split(" - ")[1]) }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary"> mdi-cash-plus </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle
            >Monto Solicitado Inicialmente</v-list-item-subtitle
          >
          <v-list-item-title
            >${{ estado.creme_m_solicitado_inicial }}</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary"> mdi-cash </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle>Monto Líquido</v-list-item-subtitle>
          <v-list-item-title
            >${{ estado.creme_m_solicitado }}</v-list-item-title
          >
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary"> mdi-calendar-expand-horizontal </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle>Cantidad de cuotas</v-list-item-subtitle>
          <v-list-item-title>{{
            estado.creme_n_cantidad_cuota
          }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="primary"> mdi-cash-check </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-subtitle>Total líquido</v-list-item-subtitle>
          <v-list-item-title>${{ estado.creme_m_capital }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <div class="d-flex justify-center">
      <v-btn
        color="success"
        class="justify-center mx-2 my-1"
        @click="acepta_rechaza(1)"
        :disabled="disabledAcepta"
        :loading="loadingAcepta == 1"
      >
        <v-icon left>mdi-check-bold</v-icon>
        Aceptar
      </v-btn>

      <v-btn
        color="error"
        class="justify-center mx-2 my-1"
        @click="acepta_rechaza(0)"
        :disabled="disabledAcepta"
        :loading="loadingAcepta == 0"
      >
        <v-icon left>mdi-close-thick</v-icon>
        Rechazar
      </v-btn>
    </div>
  </v-card>
</template>
<script>
import conversores from "@/services/conversores";
import creditos from "@/services/creditos";
import auth from "@/auth/auth";
import { mapActions } from "vuex";

export default {
  name: "DetalleCredito",
  props: {
    estado: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      loadingAcepta: -1,
      disabledAcepta: false,
    };
  },
  computed: {
    conv() {
      return conversores;
    },
    userLogged() {
      return auth.getUserLogged();
    },
  },
  methods: {
    ...mapActions(["mostrarAlerta"]),
    acepta_rechaza(respuesta) {
      this.loadingAcepta = respuesta;
      this.disabledAcepta = true;
      let form = {
        accion: 12,
        rechaza_acepta: respuesta,
        creme_s_id: this.estado.creme_s_id,
        aatcn_s_id: this.estado.aatcn_s_id,
        tippg_s_id_todos: this.estado.creme_n_cantidad_cuota,
        reqpg_m_monto_todos: this.estado.creme_m_solicitado,
      };
      let payload = {};
      creditos
        .acepta_rechaza(form)
        .then((response) => {
          let data = response.data[0];
          if (data.return_value === "1") {
            if (respuesta) {
              payload = {
                mensaje: "Crédito aceptado exitosamente",
                color: "success",
                mostrar: true,
              };
              this.$emit("reload");
            } else {
              let updatedUser = this.userLogged;
              updatedUser.b_creditos_firmar = "0";
              auth.updateUserLogged(updatedUser);
              this.$router.push({ name: "ingresa" });
              payload = {
                mensaje: "Oferta de crédito rechazada",
                color: "success",
                mostrar: true,
              };
            }
            this.disabledAcepta = false;
          } else {
            payload = {
              mensaje: data.return_msg,
              color: "error",
              mostrar: true,
            };
          }
          this.mostrarAlerta(payload);
        })
        .catch((error) => {
          console.log(error);
          payload = {
            mensaje:
              "Ha ocurrido un error al ingresar su resolución, por favor intente más tarde, si el error persiste contáctese con nosotros",
            color: "error",
            mostrar: true,
          };
          this.mostrarAlerta(payload);
        });
      this.loadingAcepta = -1;
    },
  },
};
</script>
