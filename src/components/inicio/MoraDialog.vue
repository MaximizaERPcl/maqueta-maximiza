<template>
  <v-dialog
    v-model="dialogoMora"
    width="460px"
    transition="dialog-top-transition"
    @click:outside="mostrarDialogoMora(false)"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <v-card height="100%">
      <v-toolbar color="primary" dense dark class="d-flex justify-center">
        <span class="titulo titulo-local"> Aviso de Mora </span>
      </v-toolbar>
      <v-card-text class="mt-4 pb-0" style="font-size: 18px">
        <p style="text-align: justify">
          {{ userLogged.msg_mora }}
        </p>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="error" @click="mostrarDialogoMora(false)">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapActions, mapState } from "vuex";
import auth from "@/auth/auth";
import conversores from "@/services/conversores";

export default {
  computed: {
    ...mapState(["dialogoMora"]),
    userLogged() {
      return auth.getUserLogged();
    },
    conv() {
      return conversores;
    },
  },
  methods: {
    ...mapActions(["mostrarDialogoMora"]),
  },
};
</script>

<style scoped>
.titulo-local {
  font-weight: 300;
  font-size: 22px;
  line-height: 28px;
}
</style>
