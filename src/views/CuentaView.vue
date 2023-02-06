<template>
  <div>
    <app-actualizar-datos
      v-if="ajuste === 'actualizar-datos'"
    ></app-actualizar-datos>
    <app-cambiar-clave
      v-else-if="ajuste === 'cambiar-clave'"
    ></app-cambiar-clave>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CambiarClaveVue from "@/components/cuenta/CambiarClave.vue";
import ActualizarDatosVue from "@/components/cuenta/ActualizarDatos.vue";

export default {
  metaInfo: { title: "Cuenta" },
  data: function () {
    return {
      ajuste: "",
    };
  },
  components: {
    "app-actualizar-datos": ActualizarDatosVue,
    "app-cambiar-clave": CambiarClaveVue,
  },

  computed: {
    ...mapState(["productosNav"]),
  },

  beforeMount() {
    this.ajuste = this.$route.params.ajuste;
  },
  watch: {
    "$route.params.ajuste"(value) {
      this.ajuste = value;
    },
  },
};
</script>
