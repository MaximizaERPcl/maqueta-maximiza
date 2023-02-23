<template>
  <v-dialog
    v-model="dialogoCampania"
    width="460px"
    transition="dialog-top-transition"
    @click:outside="mostrarDialogoCampania(false)"
    :fullscreen="$vuetify.breakpoint.xsOnly"
  >
    <v-card height="100%">
      <v-toolbar color="primary" dark class="d-flex justify-center">
        <span class="titulo titulo-local"> ¡ Campañas disponibles !</span>
      </v-toolbar>
      <v-card-text class="mt-4 lato" style="font-size: 16px">
        <p style="text-align: justify">
          Estimado/a socio/a le comunicamos que tiene campañas disponibles:
        </p>
        <v-hover v-slot="{ hover }">
          <v-card
            flat
            outlined
            shaped
            class="py-4 px-4"
            :elevation="hover ? 10 : 4"
            :style="{
              'border-color': $vuetify.theme.themes.light.primary,
              cursor: 'pointer',
            }"
            @click="
              mostrarDialogo(false);
              $router.push(`simulador-creditos`);
            "
            v-for="campania in userLogged.campanias"
            :key="campania.id"
          >
            <v-card-subtitle
              class="text-start font-weight-regular font-weight-bold pa-0 mb-1 primary--text"
            >
              Disponible hasta el:
              {{ conv.formatFecha2(campania.fecha_disponible, "YYYY-MM-DD") }}
            </v-card-subtitle>
            {{ campania.descripcion }}
            <v-card-actions class="mt-4">
              <v-btn small absolute right outlined color="primary">
                Ir a simular
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="error" @click="mostrarDialogoCampania(false)"
          >Cerrar</v-btn
        >
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
    ...mapState(["dialogoCampania"]),
    userLogged() {
      return auth.getUserLogged();
    },
    conv() {
      return conversores;
    },
  },
  methods: {
    ...mapActions(["mostrarDialogoCampania"]),
  },
};
</script>

<style scoped>
.titulo-local {
  font-weight: 300;
  font-size: 25px;
  line-height: 25px;
}
</style>
